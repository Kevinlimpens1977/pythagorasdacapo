const assert = require("node:assert/strict");
const test = require("node:test");
const { HttpsError } = require("firebase-functions/v2/https");
const { __test } = require("./index");

const createDocSnapshot = (id, data) => ({
  id,
  exists: Boolean(data),
  data: () => data,
});

const createDocRef = (path, store) => ({
  path,
  async get() {
    return createDocSnapshot(path.split("/").at(-1), store.docs[path]);
  },
  async set(data, options) {
    store.writes.push({ type: "set", path, data, options });
    store.docs[path] = options?.merge
      ? { ...(store.docs[path] || {}), ...data }
      : data;
  },
  async update(data) {
    store.writes.push({ type: "update", path, data });
    store.docs[path] = { ...(store.docs[path] || {}), ...data };
  },
  collection(name) {
    return {
      doc(id) {
        return createDocRef(`${path}/${name}/${id}`, store);
      },
    };
  },
});

const createDb = (initialDocs = {}) => {
  const store = { docs: { ...initialDocs }, writes: [] };

  return {
    store,
    doc(path) {
      return createDocRef(path, store);
    },
    collection(name) {
      return {
        doc(id = "generated-pending-id") {
          return createDocRef(`${name}/${id}`, store);
        },
      };
    },
  };
};

const createBucket = () => {
  const copies = [];

  return {
    copies,
    file(path) {
      return {
        path,
        async exists() {
          return [path.includes("photo-imports/")];
        },
        async copy(destination) {
          copies.push({ from: path, to: destination.path });
        },
      };
    },
  };
};

test("approveStudentPhotoImportCrop copies a matched crop and updates the student photo", async () => {
  const db = createDb({
    "users/admin-1": { role: "admin" },
    "users/student-1": { role: "student", klasId: "klas-1", displayName: "Ada" },
    "photoImports/import-1": { klasId: "klas-1", approvedCount: 0 },
    "photoImports/import-1/crops/crop-1": {
      cropStoragePath: "photo-imports/klas-1/import-1/crops/crop-1.webp",
      matchedUserId: "student-1",
      status: "matched",
    },
  });
  const bucket = createBucket();

  const result = await __test.approveStudentPhotoImportCropCore({
    auth: { uid: "admin-1" },
    data: { importId: "import-1", cropId: "crop-1", klasId: "klas-1", decision: "approve" },
    db,
    bucket,
    now: () => "timestamp",
  });

  assert.equal(result.status, "approved");
  assert.deepEqual(bucket.copies, [
    {
      from: "photo-imports/klas-1/import-1/crops/crop-1.webp",
      to: "student-photos/klas-1/student-1/avatar_256.webp",
    },
    {
      from: "photo-imports/klas-1/import-1/crops/crop-1.webp",
      to: "student-photos/klas-1/student-1/thumb_96.webp",
    },
  ]);
  assert.equal(
    db.store.docs["users/student-1"].photo.storagePath,
    "student-photos/klas-1/student-1/avatar_256.webp",
  );
  assert.equal(db.store.docs["photoImports/import-1/crops/crop-1"].status, "approved");
});

test("approveStudentPhotoImportCrop creates a pending student for pending_new decisions", async () => {
  const db = createDb({
    "users/admin-1": { role: "admin" },
    "photoImports/import-1": { klasId: "klas-1" },
    "photoImports/import-1/crops/crop-2": {
      cropStoragePath: "photo-imports/klas-1/import-1/crops/crop-2.webp",
      proposedName: "Nieuwe Leerling",
      status: "unmatched",
    },
  });
  const bucket = createBucket();

  const result = await __test.approveStudentPhotoImportCropCore({
    auth: { uid: "admin-1" },
    data: { importId: "import-1", cropId: "crop-2", klasId: "klas-1", decision: "pending_new" },
    db,
    bucket,
    now: () => "timestamp",
  });

  assert.equal(result.status, "pending_new");
  assert.equal(result.pendingId, "import-1_crop-2");
  assert.equal(db.store.docs["pendingStudents/import-1_crop-2"].status, "pending_account");
  assert.equal(db.store.docs["photoImports/import-1/crops/crop-2"].status, "pending_new");
});

test("approveStudentPhotoImportCrop rejects a matched user from another class", async () => {
  const db = createDb({
    "users/admin-1": { role: "admin" },
    "users/student-2": { role: "student", klasId: "klas-2" },
    "photoImports/import-1": { klasId: "klas-1" },
    "photoImports/import-1/crops/crop-1": {
      cropStoragePath: "photo-imports/klas-1/import-1/crops/crop-1.webp",
      matchedUserId: "student-2",
      status: "matched",
    },
  });

  await assert.rejects(
    __test.approveStudentPhotoImportCropCore({
      auth: { uid: "admin-1" },
      data: { importId: "import-1", cropId: "crop-1", klasId: "klas-1", decision: "approve" },
      db,
      bucket: createBucket(),
      now: () => "timestamp",
    }),
    (error) => error instanceof HttpsError && error.code === "failed-precondition",
  );
});
