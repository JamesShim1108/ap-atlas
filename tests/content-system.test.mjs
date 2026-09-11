import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { compileContent } from "../scripts/build-content.mjs";
import { createContentStore } from "../docs/app/content-store.js";
import { parseRoute, createRouteLoader } from "../docs/app/router.js";
import { createQuizEngine } from "../docs/app/quiz/engine.js";
import { createAttemptStore } from "../docs/app/quiz/store.js";
import { createWritingEngine, maxResponseLength } from "../docs/app/writing/engine.js";
import { createWritingStore } from "../docs/app/writing/store.js";
import { renderBlocks } from "../docs/app/blocks.js";
import { prepareImage } from "../scripts/prepare-image.mjs";

const root = new URL("../", import.meta.url);
const readGenerated = async (path) =>
  JSON.parse(await readFile(new URL(`docs/generated/${path}`, root), "utf8"));

async function contentFileMap() {
  const output = new Map();
  const manifest = JSON.parse(
    await readFile(new URL("docs/generated/manifest.json", root), "utf8"),
  );
  for (const path of manifest) output.set(path, await readGenerated(path));
  return output;
}

test("the generated catalog preserves every ready Unit 1 topic and stable route", async () => {
  const catalog = await readGenerated("catalog.json");
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.courses.length, 1);
  assert.equal(catalog.courses[0].id, "world");
  assert.equal(catalog.courses[0].readyTopicCount, 7);

  const routes = await readGenerated("world/routes.json");
  assert.equal(Object.keys(routes.topic).length, 7);
  assert.equal(Object.keys(routes.quiz).length, 15);
  assert.equal(routes.topic["world-1-2"], "world/topics/world-1-2.json");
  assert.equal(routes.writing["world-1-saq"], "world/writing/world-1-saq.json");

  const unit = await readGenerated("world/units/world-1.json");
  assert.equal(unit.topics.length, 7);
  assert.equal(
    unit.unit.quizzes[0].selections.flatMap((selection) => selection.questionIds).length,
    21,
  );
});

test("the loader is on demand: a topic does not load unrelated lessons", async () => {
  const files = await contentFileMap();
  const requested = [];
  const fetchJson = async (path) => {
    requested.push(path);
    if (!files.has(path)) throw new Error(`fixture is missing ${path}`);
    return files.get(path);
  };
  const store = createContentStore({ fetchJson });
  const page = await store.page("topic", "world-1-2");
  assert.equal(page.lesson.id, "world-1-2");
  assert.deepEqual(requested, [
    "catalog.json",
    "world/routes.json",
    "world/topics/world-1-2.json",
    "world/banks/world-1-2.json",
  ]);
  assert.equal(
    requested.some((path) => path.includes("world-1-1")),
    false,
  );
});

test("unit practice loads only the seven selected topic banks", async () => {
  const files = await contentFileMap();
  const requested = [];
  const store = createContentStore({
    fetchJson: async (path) => {
      requested.push(path);
      return files.get(path);
    },
  });
  const page = await store.page("quiz", "world-1-practice");
  assert.equal(page.quiz.questionIds.length, 21);
  assert.equal(page.bank.questions.length, 79);
  assert.equal(requested.filter((path) => path.includes("/banks/")).length, 7);
  assert.equal(
    requested.some((path) => path.includes("/topics/")),
    false,
  );
});

test("route parsing and stale loads handle navigation changes", async () => {
  assert.deepEqual(parseRoute("#/topic/world-1-1?section=terms"), {
    type: "topic",
    id: "world-1-1",
    params: new URLSearchParams("section=terms"),
  });
  assert.equal(parseRoute("#/topic/world-1-1/extra").type, "missing");
  let resolveOld;
  let resolveNew;
  const content = {
    page: (_type, id) =>
      new Promise((resolve) =>
        id === "old" ? (resolveOld = resolve) : (resolveNew = resolve),
      ),
  };
  const load = createRouteLoader(content);
  const old = load({ type: "topic", id: "old" });
  const newer = load({ type: "topic", id: "new" });
  await new Promise((resolve) => setImmediate(resolve));
  resolveNew({ id: "new" });
  assert.deepEqual(await newer, { data: { id: "new" }, stale: false });
  resolveOld({ id: "old" });
  assert.deepEqual(await old, { data: { id: "old" }, stale: true });
});

test("quiz engine preserves answer locking, scoring, and topic-scoped concepts", async () => {
  const bank = await readGenerated("world/banks/world-1-1.json");
  const engine = createQuizEngine(bank);
  const quiz = engine.quizById["world-1-1-quiz"];
  const attempt = engine.createAttempt(quiz.id, quiz.questionIds, "topic");
  const firstQuestion = engine.questionById[attempt.ids[0]];
  const wrong = (firstQuestion.correctAnswer + 1) % 4;
  assert.equal(engine.checkAnswer(attempt, wrong), true);
  assert.equal(engine.checkAnswer(attempt, firstQuestion.correctAnswer), false);
  assert.equal(engine.nextQuestion(attempt), true);
  for (; !attempt.complete;) {
    const question = engine.questionById[attempt.ids[attempt.index]];
    assert.equal(engine.checkAnswer(attempt, question.correctAnswer), true);
    assert.equal(engine.nextQuestion(attempt), true);
  }
  assert.equal(engine.validateAttempt(attempt), true);
  const result = engine.summarize(attempt);
  assert.equal(result.total, quiz.questionIds.length);
  assert.equal(result.correct, result.total - 1);
  assert.ok(result.weak.length > 0);
  assert.ok(Object.keys(engine.concepts).every((key) => key.includes("/")));
});

test("attempt storage keeps old sessions valid while preserving other quiz records", async () => {
  const values = new Map([
    [
      "page-one-attempts-v1",
      JSON.stringify({ "other-quiz": { quizId: "other-quiz", complete: false } }),
    ],
  ]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const store = createAttemptStore(() => storage);
  store.save({
    quizId: "world-1-1-quiz",
    version: 1,
    mode: "topic",
    ids: ["q1"],
    index: 0,
    answers: {},
    complete: false,
  });
  assert.equal(store.resume().quizId, "other-quiz");
  const parsed = JSON.parse(values.get("page-one-attempts-v1"));
  assert.ok(parsed["other-quiz"]);
  assert.ok(parsed["world-1-1-quiz"]);
});

test("writing engine keeps responses through review, scoring, revision, and length limits", async () => {
  const { quiz } = await readGenerated("world/writing/world-1-saq.json");
  const engine = createWritingEngine(quiz);
  const draft = engine.newDraft();
  assert.equal(engine.validate(draft), true);
  assert.equal(
    engine.updateResponse(draft, "a", "Answer with evidence and an explanation."),
    true,
  );
  assert.equal(
    engine.updateResponse(draft, "b", "Answer with evidence and an explanation."),
    true,
  );
  assert.equal(
    engine.updateResponse(draft, "c", "Answer with evidence and an explanation."),
    true,
  );
  assert.equal(engine.review(draft), true);
  assert.equal(engine.updateResponse(draft, "a", "Changed after review"), false);
  assert.equal(engine.setScore(draft, "a", 1), true);
  assert.equal(engine.setScore(draft, "b", 0), true);
  assert.equal(engine.setScore(draft, "c", 1), true);
  assert.equal(engine.total(draft), 2);
  engine.revise(draft);
  assert.equal(draft.responses.a.startsWith("Answer"), true);
  assert.equal(draft.scores.a, null);
  assert.equal(
    engine.updateResponse(draft, "a", "x".repeat(maxResponseLength + 1)),
    false,
  );
});

test("writing store reads the pre-architecture draft key", async () => {
  const { quiz } = await readGenerated("world/writing/world-1-saq.json");
  const legacy = {
    version: quiz.version,
    quizId: quiz.id,
    responses: { a: "A", b: "B", c: "C" },
    reviewed: false,
    scores: { a: null, b: null, c: null },
  };
  const values = new Map([["page-one-writing-v1", JSON.stringify(legacy)]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const store = createWritingStore(quiz, () => storage);
  assert.equal(store.draft.responses.a, "A");
  assert.equal(store.save(), true);
  assert.ok(values.has(`page-one-writing:${quiz.id}:v${quiz.version}`));
});

test("content blocks escape text and image support stays declarative", () => {
  const html = renderBlocks([
    { type: "paragraph", text: "<script>alert(1)</script>" },
    { type: "list", items: ["One", "Two"] },
    { type: "table", caption: "A table", columns: ["Name", "Value"], rows: [["A", "1"]] },
  ]);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /<table>/);
});

test("image preparation emits responsive WebP variants without enlarging", async () => {
  const { default: sharp } = await import("sharp");
  const folder = await mkdtemp(join(tmpdir(), "page-one-image-"));
  const input = join(folder, "original.png");
  const output = join(folder, "assets");
  try {
    await sharp({
      create: { width: 900, height: 600, channels: 3, background: "#245548" },
    })
      .png()
      .toFile(input);
    const result = await prepareImage(input, output, "sample-map");
    assert.equal(result.width, 900);
    assert.deepEqual(
      result.variants.map((item) => item.width),
      [640],
    );
    const info = await sharp(join(output, result.file)).metadata();
    assert.equal(info.format, "webp");
    assert.equal(info.width, 900);
    assert.equal(info.height, 600);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

test("content compiles from folder discovery rather than a hardcoded topic list", async () => {
  const output = await compileContent(
    new URL("../", import.meta.url).pathname.replace(/\/$/, ""),
  );
  assert.equal(output.has("catalog.json"), true);
  assert.equal([...output.keys()].filter((path) => path.includes("/topics/")).length, 7);
  assert.equal([...output.keys()].filter((path) => path.includes("/banks/")).length, 7);
});
