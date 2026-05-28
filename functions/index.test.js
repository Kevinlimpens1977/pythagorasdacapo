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

const createQuerySnapshot = (docs) => ({
  size: docs.length,
  docs,
});

const createDb = (initialDocs = {}) => {
  const store = { docs: { ...initialDocs }, writes: [] };

  return {
    store,
    batch() {
      const operations = [];
      return {
        delete(ref) {
          operations.push({ type: "delete", ref });
        },
        update(ref, data) {
          operations.push({ type: "update", ref, data });
        },
        async commit() {
          operations.forEach((operation) => {
            store.writes.push({ type: operation.type, path: operation.ref.path, data: operation.data });
            if (operation.type === "delete") {
              delete store.docs[operation.ref.path];
            } else if (operation.type === "update") {
              store.docs[operation.ref.path] = { ...(store.docs[operation.ref.path] || {}), ...operation.data };
            }
          });
        },
      };
    },
    doc(path) {
      return createDocRef(path, store);
    },
    collection(name) {
      return {
        doc(id = "generated-pending-id") {
          return createDocRef(`${name}/${id}`, store);
        },
        where(field, operator, value) {
          if (operator !== "==") throw new Error(`Unsupported fake operator ${operator}`);
          return {
            async get() {
              return createQuerySnapshot(
                Object.entries(store.docs)
                  .filter(([path, data]) => path.startsWith(`${name}/`) && !path.slice(name.length + 1).includes("/") && data?.[field] === value)
                  .map(([path, data]) => ({
                    id: path.split("/").at(-1),
                    ref: createDocRef(path, store),
                    data: () => data,
                  })),
              );
            },
          };
        },
        async get() {
          return createQuerySnapshot(
            Object.entries(store.docs)
              .filter(([path]) => path.startsWith(`${name}/`) && !path.slice(name.length + 1).includes("/"))
              .map(([path, data]) => ({
                id: path.split("/").at(-1),
                ref: createDocRef(path, store),
                data: () => data,
              })),
          );
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
      firstName: "Nieuwe",
      lastName: "Leerling",
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
  assert.equal(db.store.docs["pendingStudents/import-1_crop-2"].firstName, "Nieuwe");
  assert.equal(db.store.docs["pendingStudents/import-1_crop-2"].lastName, "Leerling");
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

test("deleteAllStudentData deletes students while preserving admins and protected emails", async () => {
  const db = createDb({
    "users/admin-1": { role: "admin", email: "admin@example.com" },
    "users/student-1": { role: "student", email: "leerling@example.com" },
    "users/student-2": { role: "student", email: "vragen@scheikundeles.nl" },
    "users/student-3": { role: "student", email: "kevlimpens@gmail.com" },
    "users/student-4": { role: "student", email: "ander@example.com" },
    "voortgang/student-1_block-1": { userId: "student-1" },
    "voortgang/student-2_block-1": { userId: "student-2" },
    "voortgang/student-4_block-1": { userId: "student-4" },
    "pendingStudents/pending-1": { displayNameProposed: "Nieuwe" },
    "klassen/klas-1": { name: "EOA", studentOverrides: { "student-1": true } },
  });

  const result = await __test.deleteAllStudentDataCore({
    auth: { uid: "admin-1" },
    db,
    now: () => "timestamp",
  });

  assert.equal(result.deletedStudents, 2);
  assert.equal(result.deletedProgress, 2);
  assert.equal(result.deletedPendingStudents, 1);
  assert.equal(db.store.docs["users/student-1"], undefined);
  assert.equal(db.store.docs["users/student-4"], undefined);
  assert.equal(db.store.docs["users/student-2"].email, "vragen@scheikundeles.nl");
  assert.equal(db.store.docs["users/student-3"].email, "kevlimpens@gmail.com");
  assert.deepEqual(db.store.docs["klassen/klas-1"].studentOverrides, {});
});

test("deleteAllStudentData rejects non-admin callers", async () => {
  const db = createDb({
    "users/docent-1": { role: "docent", email: "docent@example.com" },
  });

  await assert.rejects(
    __test.deleteAllStudentDataCore({
      auth: { uid: "docent-1" },
      db,
      now: () => "timestamp",
    }),
    (error) => error instanceof HttpsError && error.code === "permission-denied",
  );
});
