const assert = require("node:assert/strict");
const test = require("node:test");
const { __test } = require("./index");

const {
  gradeClosedQuestionCore,
  QUESTION_GRADING_RATE_LIMIT_MAX,
  QUESTION_GRADING_RATE_LIMIT_WINDOW_MS,
} = __test;

const createDb = (initialDocs = {}) => {
  const store = { docs: { ...initialDocs }, writes: [] };

  const createDocRef = (path) => ({
    path,
    async get() {
      return {
        id: path.split("/").at(-1),
        exists: Boolean(store.docs[path]),
        data: () => store.docs[path],
      };
    },
    async set(data, options) {
      store.writes.push({ path, data, options });
      store.docs[path] = options?.merge ? { ...(store.docs[path] || {}), ...data } : data;
    },
    async update(data) {
      store.writes.push({ path, data });
      store.docs[path] = { ...(store.docs[path] || {}), ...data };
    },
  });

  return { store, doc: (path) => createDocRef(path) };
};

// Een echte leerling in een echte klas, met een echt toegewezen lesblok.
const baseDocs = (vraag, { klas, block } = {}) => ({
  "users/student-1": { role: "student", klasId: "klas-1", displayName: "Ada" },
  "klassen/klas-1": klas || { enabledParagrafen: ["par-1"] },
  "vraag/vraag-1": vraag,
  "contentBlocks/block-1": block || {
    type: "question",
    paragraafId: "par-1",
    linkedVraagId: "vraag-1",
  },
});

const publishedQuestion = (extra = {}) => ({
  status: "published",
  paragraafId: "par-1",
  ...extra,
});

const meerkeuzeVraag = publishedQuestion({
  vraagtype: "meerkeuze",
  title: "Hoofdstad",
  antwoord: {
    type: "meerkeuze",
    options: [
      { id: "option-1", text: "Parijs", correct: true, explanation: "Parijs is de hoofdstad." },
      { id: "option-2", text: "Lyon", correct: false },
      { id: "option-3", text: "Marseille", correct: false },
    ],
  },
});

const gradeAs = (db, data, overrides = {}) =>
  gradeClosedQuestionCore({
    auth: { uid: "student-1" },
    data,
    db,
    nowMs: 1_000_000,
    ...overrides,
  });

test("gradeClosedQuestion grades a multiple choice answer server-side", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag));

  const result = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { "option-1": true },
  });

  assert.equal(result.success, true);
  assert.equal(result.canGrade, true);
  assert.equal(result.isCorrect, true);
  assert.equal(result.reason, "graded");
  assert.equal(result.questionType, "meerkeuze");
});

test("gradeClosedQuestion marks a wrong multiple choice answer as wrong, not as teacher review", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag));

  const result = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { "option-2": true },
  });

  assert.equal(result.canGrade, true);
  assert.equal(result.isCorrect, false);
  assert.equal(result.reason, "graded");
});

// Dit is de kern van de beveiliging: het oordeel mag terug, de sleutel nooit.
test("gradeClosedQuestion never returns the answer key over the wire", async () => {
  const vraag = publishedQuestion({
    vraagtype: "invullen",
    antwoord: {
      type: "invullen",
      segments: [
        { type: "text", text: "De hoofdstad is " },
        { type: "gap", id: "gap-1", answer: "GEHEIMGAT" },
      ],
      gaps: [{ id: "gap-1", answer: "GEHEIMGAT" }],
      modelAnswer: "GEHEIMMODEL",
      expected: "GEHEIMGETAL",
      unit: "cm",
    },
    content: { text: "GEHEIMEVRAAGTEKST" },
  });
  const db = createDb(baseDocs(vraag));

  const result = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { "gap-1": "iets anders" },
  });

  const serialized = JSON.stringify(result);
  ["GEHEIMGAT", "GEHEIMMODEL", "GEHEIMGETAL", "GEHEIMEVRAAGTEKST"].forEach((secret) => {
    assert.equal(serialized.includes(secret), false, `antwoordsleutel lekte via ${secret}`);
  });
  assert.equal(result.canGrade, true);
  assert.equal(result.isCorrect, false);
  assert.deepEqual(result.parts, [{ id: "gap-1", label: "Invulveld 1", isCorrect: false }]);
});

test("gradeClosedQuestion redacts multiple choice part status until the answer is correct", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag));

  const wrong = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: {},
  });

  // Zonder deze redactie zou "optie 1 is fout aangevinkt" verklappen dat optie
  // 1 juist is: een leerling leest de hele sleutel uit een lege inzending.
  assert.deepEqual(wrong.parts, []);
  assert.equal(wrong.partsRedacted, true);

  const right = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { "option-1": true },
  });

  assert.equal(right.partsRedacted, false);
  assert.equal(right.parts.length, 3);
  assert.equal(right.parts.every((part) => part.isCorrect), true);
  assert.equal(JSON.stringify(right).includes("Parijs"), false);
});

test("gradeClosedQuestion grades numeriek, volgorde and koppelen through the shared layer", async () => {
  const numeriekDb = createDb(baseDocs(publishedQuestion({
    vraagtype: "numeriek",
    antwoord: { type: "numeriek", expected: "12", unit: "cm", tolerance: "0.5" },
  })));
  const numeriek = await gradeAs(numeriekDb, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { expectedValue: "12,3" },
  });
  assert.equal(numeriek.canGrade, true);
  assert.equal(numeriek.isCorrect, true);

  const volgordeDb = createDb(baseDocs(publishedQuestion({
    vraagtype: "volgorde",
    antwoord: {
      type: "volgorde",
      items: [
        { id: "item-1", text: "Eerst" },
        { id: "item-2", text: "Dan" },
        { id: "item-3", text: "Slot" },
      ],
    },
  })));
  const volgordeGoed = await gradeAs(volgordeDb, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { orderItems: [{ id: "item-1" }, { id: "item-2" }, { id: "item-3" }] },
  });
  assert.equal(volgordeGoed.canGrade, true);
  assert.equal(volgordeGoed.isCorrect, true);

  const volgordeFout = await gradeAs(volgordeDb, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { orderItems: [{ id: "item-3" }, { id: "item-2" }, { id: "item-1" }] },
  });
  assert.equal(volgordeFout.canGrade, true);
  assert.equal(volgordeFout.isCorrect, false);

  const koppelenDb = createDb(baseDocs(publishedQuestion({
    vraagtype: "koppelen",
    antwoord: {
      type: "koppelen",
      pairs: [
        { id: "pair-1", left: "hond", right: "blaft" },
        { id: "pair-2", left: "kat", right: "miauwt" },
      ],
    },
  })));
  const koppelen = await gradeAs(koppelenDb, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { pairs: { "pair-1": "pair-1", "pair-2": "pair-2" } },
  });
  assert.equal(koppelen.isCorrect, true);
});

test("gradeClosedQuestion keeps teacher review for a question without an answer key", async () => {
  const db = createDb(baseDocs(publishedQuestion({
    vraagtype: "numeriek",
    antwoord: { type: "numeriek", unit: "cm" },
  })));

  const result = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { expectedValue: "12" },
  });

  assert.equal(result.canGrade, false);
  assert.equal(result.isCorrect, false);
  assert.equal(result.reason, "no-answer-key");
});

test("gradeClosedQuestion leaves open questions to assessOpenAnswer", async () => {
  const db = createDb(baseDocs(publishedQuestion({
    vraagtype: "open",
    antwoord: { type: "open", modelAnswer: "GEHEIMMODEL" },
  })));

  const result = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { openAnswer: "iets" },
  });

  assert.equal(result.canGrade, false);
  assert.equal(result.reason, "needs-human");
  assert.equal(JSON.stringify(result).includes("GEHEIMMODEL"), false);
});

test("gradeClosedQuestion requires a signed in caller", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag));

  await assert.rejects(
    () => gradeClosedQuestionCore({ auth: null, data: { vraagId: "vraag-1" }, db }),
    (error) => error.code === "unauthenticated",
  );
});

test("gradeClosedQuestion refuses a question outside the student assignment", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag, { klas: { enabledParagrafen: ["par-9"] } }));

  await assert.rejects(
    () => gradeAs(db, { vraagId: "vraag-1", blockId: "block-1", answers: {} }),
    (error) => error.code === "permission-denied",
  );
});

test("gradeClosedQuestion accepts a paragraph assigned through a student override", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag, {
    klas: {
      enabledParagrafen: ["par-9"],
      studentOverrides: { "student-1": { extraParagrafen: ["par-1"] } },
    },
  }));

  const result = await gradeAs(db, {
    vraagId: "vraag-1",
    blockId: "block-1",
    answers: { "option-1": true },
  });

  assert.equal(result.isCorrect, true);
});

test("gradeClosedQuestion refuses a block that does not belong to the question", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag, {
    block: { paragraafId: "par-1", linkedVraagId: "vraag-99" },
  }));

  await assert.rejects(
    () => gradeAs(db, { vraagId: "vraag-1", blockId: "block-1", answers: {} }),
    (error) => error.code === "permission-denied",
  );
});

test("gradeClosedQuestion refuses a block the class did not enable", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag, {
    klas: { enabledParagrafen: ["par-1"], enabledContentBlocks: { "par-1": ["block-2"] } },
  }));

  await assert.rejects(
    () => gradeAs(db, { vraagId: "vraag-1", blockId: "block-1", answers: {} }),
    (error) => error.code === "permission-denied",
  );
});

test("gradeClosedQuestion refuses an unpublished question", async () => {
  const db = createDb(baseDocs({ ...meerkeuzeVraag, status: "draft" }));

  await assert.rejects(
    () => gradeAs(db, { vraagId: "vraag-1", blockId: "block-1", answers: {} }),
    (error) => error.code === "failed-precondition",
  );
});

test("gradeClosedQuestion throttles a student who keeps guessing the same question", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag));
  const payload = { vraagId: "vraag-1", blockId: "block-1", answers: { "option-2": true } };

  for (let attempt = 0; attempt < QUESTION_GRADING_RATE_LIMIT_MAX; attempt += 1) {
     
    await gradeAs(db, payload);
  }

  await assert.rejects(
    () => gradeAs(db, payload),
    (error) => error.code === "resource-exhausted",
  );

  // Na het venster mag de leerling gewoon weer verder.
  const afterWindow = await gradeAs(db, payload, {
    nowMs: 1_000_000 + QUESTION_GRADING_RATE_LIMIT_WINDOW_MS + 1,
  });
  assert.equal(afterWindow.canGrade, true);
});

test("gradeClosedQuestion counts the throttle per question, not per student", async () => {
  const db = createDb({
    ...baseDocs(meerkeuzeVraag),
    "vraag/vraag-2": meerkeuzeVraag,
    "contentBlocks/block-2": { paragraafId: "par-1", linkedVraagId: "vraag-2" },
  });

  for (let attempt = 0; attempt < QUESTION_GRADING_RATE_LIMIT_MAX; attempt += 1) {
     
    await gradeAs(db, { vraagId: "vraag-1", blockId: "block-1", answers: {} });
  }

  const other = await gradeAs(db, { vraagId: "vraag-2", blockId: "block-2", answers: { "option-1": true } });
  assert.equal(other.isCorrect, true);
});

test("gradeClosedQuestion lets staff grade without an assignment or throttle", async () => {
  const db = createDb({
    ...baseDocs(meerkeuzeVraag, { klas: { enabledParagrafen: [] } }),
    "users/docent-1": { role: "supervisor" },
  });

  for (let attempt = 0; attempt < QUESTION_GRADING_RATE_LIMIT_MAX + 2; attempt += 1) {
     
    const result = await gradeClosedQuestionCore({
      auth: { uid: "docent-1" },
      data: { vraagId: "vraag-1", answers: { "option-1": true } },
      db,
      nowMs: 1_000_000,
    });
    assert.equal(result.isCorrect, true);
  }
});

test("gradeClosedQuestion refuses an oversized answer payload", async () => {
  const db = createDb(baseDocs(meerkeuzeVraag));

  await assert.rejects(
    () => gradeAs(db, {
      vraagId: "vraag-1",
      blockId: "block-1",
      answers: { openAnswer: "x".repeat(30000) },
    }),
    (error) => error.code === "invalid-argument",
  );
});

test("gradeClosedQuestion gives an unknown block no extra rights, only the paragraph check", async () => {
  const assigned = createDb(baseDocs(meerkeuzeVraag));
  const result = await gradeAs(assigned, {
    vraagId: "vraag-1",
    blockId: "block-does-not-exist",
    answers: { "option-1": true },
  });
  assert.equal(result.isCorrect, true);

  const unassigned = createDb(baseDocs(meerkeuzeVraag, { klas: { enabledParagrafen: ["par-9"] } }));
  await assert.rejects(
    () => gradeAs(unassigned, { vraagId: "vraag-1", blockId: "block-does-not-exist", answers: {} }),
    (error) => error.code === "permission-denied",
  );
});
