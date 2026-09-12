import { readdir, readFile, mkdir, writeFile, rm, access } from "node:fs/promises";
import { resolve, join, dirname, relative } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  requireValue,
  requireText,
  requireId,
  uniqueById,
  safeUrl,
  validateMetadata,
  validateLesson,
  validateSelections,
  validateWriting,
  validateBlocks,
} from "./lib/validate.mjs";
import { loadAssets, mergeAssets, usedAssets } from "./lib/assets.mjs";
import { validateTermSet } from "./lib/terms.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
const directories = async (path) =>
  (await readdir(path, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
const readModule = async (path, name) => {
  const module = await import(pathToFileURL(path));
  requireValue(module[name] !== undefined, path, `expected an export named ${name}`);
  // Prevent executable values, undefined fields, and non-JSON data reaching the browser.
  JSON.stringify(module[name], (_, value) => {
    requireValue(
      !["function", "undefined", "symbol", "bigint"].includes(typeof value),
      path,
      "content exports must contain plain data",
    );
    requireValue(
      typeof value !== "number" || Number.isFinite(value),
      path,
      "numbers must be finite",
    );
    return value;
  });
  return structuredClone(module[name]);
};
const optionalModule = async (path, name, fallback) =>
  (await exists(path)) ? readModule(path, name) : fallback;
const topicSummary = (lesson) =>
  Object.fromEntries(
    [
      "id",
      "courseId",
      "unitId",
      "order",
      "code",
      "title",
      "period",
      "status",
      "summary",
    ].map((key) => [key, lesson[key]]),
  );

export async function compileContent(root = projectRoot) {
  const docsRoot = join(root, "docs"),
    contentRoot = join(docsRoot, "content");
  const output = new Map(),
    catalog = [],
    seenCourses = new Set();
  const emit = (path, data) => {
    requireValue(!output.has(path), path, "duplicate generated path");
    output.set(path, json(data));
  };
  const assetFile = join(contentRoot, "assets.js");
  const globalAssets = await loadAssets(
    await optionalModule(assetFile, "assets", []),
    assetFile,
    docsRoot,
  );

  for (const folder of await directories(contentRoot)) {
    const courseRoot = join(contentRoot, folder),
      courseFile = join(courseRoot, "course.js");
    if (!(await exists(courseFile))) continue;
    const course = await readModule(courseFile, "course");
    validateMetadata(course, courseFile);
    requireValue(
      /^[a-z][a-z0-9]*$/.test(course.id),
      courseFile,
      "course ID must be lowercase letters/digits, without hyphens; folder names may use hyphens",
    );
    requireValue(!seenCourses.has(course.id), courseFile, "duplicate course ID");
    seenCourses.add(course.id);
    requireValue(
      Number.isInteger(course.order) && course.order > 0,
      courseFile,
      "add a positive catalog order",
    );
    requireText(course.shortTitle, courseFile);
    requireText(course.description, courseFile);
    requireText(course.period, courseFile);
    const sourceList = await optionalModule(
      join(courseRoot, "sources.js"),
      "sources",
      [],
    );
    const sources = uniqueById(sourceList, `${folder}/sources.js`);
    for (const source of sourceList) {
      requireText(source.label, courseFile);
      if (source.url) safeUrl(source.url, courseFile);
    }
    const framework = await optionalModule(
      join(courseRoot, "framework.js"),
      "framework",
      null,
    );
    if (framework) {
      for (const field of ["id", "name", "title", "intro", "sourceNote"])
        requireText(framework[field], courseFile);
      const themeIds = new Set();
      for (const theme of framework.themes) {
        requireValue(!themeIds.has(theme.id), courseFile, "duplicate framework theme");
        themeIds.add(theme.id);
        for (const field of ["id", "shortTitle", "title", "question", "example"])
          requireText(theme[field], courseFile);
      }
    }
    const courseAssetsFile = join(courseRoot, "assets.js");
    const courseAssets = mergeAssets(
      globalAssets,
      await loadAssets(
        await optionalModule(courseAssetsFile, "assets", []),
        courseAssetsFile,
        docsRoot,
      ),
    );
    const units = [],
      topics = new Map(),
      questionIds = new Set();
    const routes = {
      unit: {},
      topic: {},
      quiz: {},
      guide: {},
      writing: {},
      terms: {},
      "term-set": {},
    };
    function route(type, id, path) {
      requireId(id, `${folder} route`);
      requireValue(
        id.startsWith(`${course.id}-`),
        folder,
        `route ID ${id} must start with ${course.id}-`,
      );
      requireValue(!routes[type][id], folder, `duplicate ${type} route ${id}`);
      routes[type][id] = path;
    }

    // One canonical set can serve multiple units, without copying its definitions.
    const termsRoot = join(courseRoot, "terms");
    const termSets = new Map();
    if (await exists(termsRoot)) {
      for (const filename of (await readdir(termsRoot))
        .filter((name) => name.endsWith(".js"))
        .sort()) {
        const file = join(termsRoot, filename);
        const set = await readModule(file, "termSet");
        validateTermSet(set, course.id, file);
        requireValue(!termSets.has(set.id), file, "duplicate term-set ID");
        set.revision = createHash("sha256")
          .update(json(set.cards))
          .digest("hex")
          .slice(0, 16);
        termSets.set(set.id, set);
        route("term-set", set.id, `${course.id}/terms/${set.id}.json`);
      }
    }

    // Discover topic folders once. All navigation and quiz ownership derive from these records.
    for (const unitFolder of await directories(courseRoot)) {
      const unitRoot = join(courseRoot, unitFolder),
        unitFile = join(unitRoot, "unit.js");
      if (!(await exists(unitFile))) continue;
      const unit = await readModule(unitFile, "unit");
      validateMetadata(unit, unitFile);
      requireValue(unit.courseId === course.id, unitFile, "wrong courseId");
      if (unit.status === "ready") requireText(unit.description, unitFile);
      requireText(unit.period, unitFile);
      requireValue(
        Number.isInteger(unit.number) && unit.number > 0,
        unitFile,
        "unit number must be positive",
      );
      const unitTopics = [];
      if (await exists(join(unitRoot, "topics"))) {
        for (const topicFolder of await directories(join(unitRoot, "topics"))) {
          const topicRoot = join(unitRoot, "topics", topicFolder);
          const lesson = await readModule(join(topicRoot, "lesson.js"), "lesson");
          const bank = await readModule(join(topicRoot, "questions.js"), "bank");
          const topicAssetsFile = join(topicRoot, "assets.js");
          const assets = mergeAssets(
            courseAssets,
            await loadAssets(
              await optionalModule(topicAssetsFile, "assets", []),
              topicAssetsFile,
              docsRoot,
            ),
          );
          requireValue(
            lesson.unitId === unit.id && lesson.courseId === course.id,
            topicRoot,
            "topic ownership does not match its folder",
          );
          validateLesson(lesson, bank, sources, assets, framework, topicRoot);
          requireValue(!topics.has(lesson.id), topicRoot, "duplicate topic ID");
          for (const question of bank.questions) {
            requireValue(
              !questionIds.has(question.id),
              topicRoot,
              `duplicate question ID ${question.id} in this course`,
            );
            questionIds.add(question.id);
          }
          const record = { lesson, bank, assets, unit };
          topics.set(lesson.id, record);
          unitTopics.push(record);
        }
      }
      requireValue(
        new Set(unitTopics.map((record) => record.lesson.order)).size ===
          unitTopics.length,
        unitFile,
        "topic order values must be unique within the unit",
      );
      unitTopics.sort((a, b) => a.lesson.order - b.lesson.order);
      units.push({ unit, unitRoot, topics: unitTopics });
    }
    uniqueById(
      units.map((record) => record.unit),
      courseFile,
    );
    requireValue(
      new Set(units.map((record) => record.unit.number)).size === units.length,
      courseFile,
      "unit numbers must be unique",
    );
    units.sort((a, b) => a.unit.number - b.unit.number);
    for (const set of termSets.values()) {
      const owners = units.filter(({ unit }) => unit.termSetIds?.includes(set.id));
      requireValue(owners.length > 0, termsRoot, `unreferenced term set ${set.id}`);
      emit(routes["term-set"][set.id], {
        course,
        set,
        units: owners.map(({ unit }) => ({
          id: unit.id,
          number: unit.number,
          title: unit.title,
        })),
      });
    }
    const readyTopics = [];
    for (const record of units) {
      const { unit, unitRoot } = record;
      const guide = await optionalModule(join(unitRoot, "study-guide.js"), "guide", null);
      const writing = await optionalModule(
        join(unitRoot, "writing.js"),
        "writingQuizzes",
        [],
      );
      uniqueById(writing, unitRoot);
      const availableTopics = record.topics.filter(
        (topic) =>
          course.status === "ready" &&
          unit.status === "ready" &&
          topic.lesson.status === "ready",
      );
      readyTopics.push(...availableTopics.map((topic) => topicSummary(topic.lesson)));
      const setIds = unit.termSetIds || [];
      requireValue(
        Array.isArray(setIds) && new Set(setIds).size === setIds.length,
        unitRoot,
        "duplicate term-set references",
      );
      const unitTermSets = setIds.map((id) => {
        const set = termSets.get(id);
        requireValue(Boolean(set), unitRoot, `unknown term set ${id}`);
        return {
          id: set.id,
          title: set.title,
          source: set.source,
          count: set.cards.length,
        };
      });
      const unitInfo = {
        ...unit,
        quizzes: unit.status === "ready" ? unit.quizzes || [] : [],
        termSets: unitTermSets,
        topicQuizzes: availableTopics.flatMap(({ bank }) =>
          bank.quizzes
            .filter((quiz) => quiz.quizType === "topic")
            .map((quiz) => ({ id: quiz.id, title: quiz.title })),
        ),
        topicCount: availableTopics.length,
        firstTopic: availableTopics.length
          ? topicSummary(availableTopics[0].lesson)
          : null,
        hasGuide: Boolean(guide) && unit.status === "ready",
        writingQuizzes: (unit.status === "ready" ? writing : []).map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          partCount: quiz.parts.length,
        })),
      };
      record.info = unitInfo;
      route("unit", unit.id, `${course.id}/units/${unit.id}.json`);
      emit(routes.unit[unit.id], {
        course,
        unit: unitInfo,
        topics: record.topics.map((topic) => topicSummary(topic.lesson)),
      });
      // The set picker needs metadata only. Cards load when a set is selected.
      route("terms", unit.id, routes.unit[unit.id]);
      if (unit.status !== "ready") continue;
      for (const topic of availableTopics) {
        const { lesson, bank, assets } = topic;
        const context = {
          course,
          unit: unitInfo,
          topic: topicSummary(lesson),
          framework,
        };
        const lessonAssets = usedAssets(
          lesson.sections.flatMap((section) => section.blocks),
          assets,
        );
        const bankAssets = usedAssets(
          bank.questions.flatMap((question) => question.stimulusBlocks || []),
          assets,
        );
        const concepts = Object.fromEntries(
          lesson.sections.map((section) => [
            section.id,
            {
              id: section.id,
              title: section.conceptTitle,
              section: section.id,
              topicId: lesson.id,
            },
          ]),
        );
        const bankPath = `${course.id}/banks/${lesson.id}.json`;
        emit(bankPath, { ...context, ...bank, concepts, assets: bankAssets });
        for (const quiz of bank.quizzes) route("quiz", quiz.id, bankPath);
        route("topic", lesson.id, `${course.id}/topics/${lesson.id}.json`);
        emit(routes.topic[lesson.id], {
          ...context,
          lesson,
          bankPath,
          sources: lesson.sourceIds.map((id) => sources.get(id)),
          assets: lessonAssets,
        });
      }
      for (const quiz of unit.quizzes || []) {
        requireText(quiz.title, unitRoot);
        requireValue(
          quiz.courseId === course.id &&
            quiz.unitId === unit.id &&
            quiz.quizType === "unit",
          unitRoot,
          `wrong ownership or type on ${quiz.id}`,
        );
        const ids = [],
          bankPaths = [];
        for (const selection of quiz.selections) {
          const topic = topics.get(selection.topicId);
          requireValue(
            topic?.lesson.unitId === unit.id && topic?.lesson.status === "ready",
            unitRoot,
            `unavailable quiz topic ${selection.topicId}`,
          );
          validateSelections(
            selection.questionIds,
            new Map(topic.bank.questions.map((question) => [question.id, question])),
            unitRoot,
          );
          ids.push(...selection.questionIds);
          bankPaths.push(`${course.id}/banks/${selection.topicId}.json`);
        }
        requireValue(
          ids.length > 0 && new Set(ids).size === ids.length,
          unitRoot,
          "unit quiz needs unique questions",
        );
        route("quiz", quiz.id, `${course.id}/quizzes/${quiz.id}.json`);
        emit(routes.quiz[quiz.id], {
          course,
          unit: unitInfo,
          framework,
          quiz: { ...quiz, questionIds: ids },
          bankPaths: [...new Set(bankPaths)],
        });
      }
      if (guide) {
        for (const field of ["title", "headline", "essential"])
          requireText(guide[field], unitRoot);
        for (const item of guide.timeline) {
          requireText(item.date, unitRoot);
          requireText(item.text, unitRoot);
        }
        requireValue(
          Array.isArray(guide.pitfalls),
          unitRoot,
          "guide needs a pitfalls array",
        );
        guide.pitfalls.forEach((text) => requireText(text, unitRoot));
        validateBlocks([{ type: "table", ...guide.comparisons }], new Map(), unitRoot);
        const guideSources = guide.sourceIds.map((id) => {
          requireValue(sources.has(id), unitRoot, `unknown source ${id}`);
          return sources.get(id);
        });
        route("guide", unit.id, `${course.id}/guides/${unit.id}.json`);
        emit(routes.guide[unit.id], {
          course,
          unit: unitInfo,
          framework,
          guide,
          sources: guideSources,
          topics: availableTopics.map(({ lesson }) => ({
            ...topicSummary(lesson),
            bigIdea: lesson.bigIdea,
            readingGuide: lesson.readingGuide || null,
          })),
        });
      }
      for (const quiz of writing) {
        validateWriting(quiz, topics, framework, unit, unitRoot);
        route("writing", quiz.id, `${course.id}/writing/${quiz.id}.json`);
        emit(routes.writing[quiz.id], { course, unit: unitInfo, framework, quiz });
      }
    }
    const catalogEntry = {
      ...course,
      readyTopicCount: readyTopics.length,
      previewTopics: readyTopics.slice(0, 3),
      firstTopic: readyTopics[0] || null,
      indexPath: `${course.id}/index.json`,
      routesPath: `${course.id}/routes.json`,
    };
    emit(catalogEntry.indexPath, {
      course: catalogEntry,
      units: units.map((record) => record.info),
    });
    emit(catalogEntry.routesPath, routes);
    // Search remains per course. It is generated now and can be fetched by a search UI later.
    emit(
      `${course.id}/search.json`,
      readyTopics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        summary: topic.summary,
        unitId: topic.unitId,
        url: `#/topic/${topic.id}`,
      })),
    );
    catalog.push(catalogEntry);
  }
  catalog.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const revision = createHash("sha256")
    .update(json([...output]))
    .digest("hex")
    .slice(0, 16);
  emit("catalog.json", { schemaVersion: 1, revision, courses: catalog });
  return output;
}

export async function buildContent({ root = projectRoot, check = false } = {}) {
  const output = await compileContent(root),
    outputRoot = join(root, "docs/generated");
  const paths = [...output.keys()].sort();
  const manifestPath = join(outputRoot, "manifest.json");
  const previous = (await exists(manifestPath))
    ? JSON.parse(await readFile(manifestPath, "utf8"))
    : [];
  const stale = previous.filter((path) => !paths.includes(path));
  for (const [path, data] of output) {
    const file = join(outputRoot, path);
    if (check) {
      requireValue(
        (await exists(file)) && (await readFile(file, "utf8")) === data,
        path,
        "generated data is stale; run npm run build",
      );
    } else {
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, data);
    }
  }
  if (check) {
    requireValue(
      stale.length === 0 && json(previous) === json(paths),
      "generated manifest",
      "run npm run build to update generated paths",
    );
  } else {
    for (const path of stale) {
      requireValue(
        !relative(outputRoot, resolve(outputRoot, path)).startsWith(".."),
        "generated manifest",
        "unsafe stale path",
      );
      await rm(join(outputRoot, path), { force: true });
    }
    await writeFile(manifestPath, json(paths));
  }
  console.log(
    `${check ? "Validated" : "Built"} ${paths.length} content files. Catalog: ${Buffer.byteLength(output.get("catalog.json"))} bytes.`,
  );
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildContent({ check: process.argv.includes("--check") });
}
