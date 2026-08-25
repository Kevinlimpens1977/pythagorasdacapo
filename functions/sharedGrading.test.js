const assert = require("node:assert/strict");
const test = require("node:test");
const { __test } = require("./index");

// De functions-kant van dezelfde drift-controle als
// src/lib/functionsSharedGrading.test.js. Beide kanten van de pakketgrens
// bewaken dat er maar EEN nakijklaag is: src/lib/questionGrading.js.
const loadSyncTooling = () => import("../scripts/sync-functions-shared.mjs");

test("functions/shared is a byte-identical copy of the shared grading layer in src/lib", async () => {
  const { verifySharedGradingSync } = await loadSyncTooling();
  const status = verifySharedGradingSync();

  assert.deepEqual(status.missing, []);
  assert.deepEqual(status.drifted, []);
  assert.deepEqual(status.stale, []);
  assert.equal(status.inSync, true, "Draai: node scripts/sync-functions-shared.mjs");
});

test("the functions package can actually load the shared grading layer", async () => {
  const layer = await __test.loadSharedGradingLayer();

  assert.equal(typeof layer.gradeQuestionAnswer, "function");
  assert.equal(typeof layer.buildQuestionPreviewModel, "function");
  assert.equal(layer.GRADE_REASONS.NO_ANSWER_KEY, "no-answer-key");
});

test("the server runs the very same grader the digibord uses", async () => {
  const [layer, source] = await Promise.all([
    __test.loadSharedGradingLayer(),
    import("../src/lib/questionGrading.js"),
  ]);

  const vraag = {
    vraagtype: "meerkeuze",
    antwoord: {
      type: "meerkeuze",
      options: [
        { id: "option-1", text: "Goed", correct: true },
        { id: "option-2", text: "Fout", correct: false },
      ],
    },
  };
  const answers = { "option-1": true };

  assert.deepEqual(
    layer.gradeQuestionAnswer({ vraag, answers }),
    source.gradeQuestionAnswer({ vraag, answers }),
  );
});
