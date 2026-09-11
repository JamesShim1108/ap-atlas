// Content contracts run before generated browser data is written.
export function requireValue(condition, location, message) {
  if (!condition) throw new Error(`${location}: ${message}`);
}

export function requireText(value, location) {
  requireValue(
    typeof value === "string" && value.trim().length > 0,
    location,
    "expected nonempty text",
  );
}

export function requireId(value, location) {
  requireValue(
    typeof value === "string" && /^[a-z][a-z0-9-]*$/.test(value),
    location,
    "use a stable lowercase ID with hyphens",
  );
}

export function uniqueById(records, location) {
  const result = new Map();
  for (const record of records) {
    requireId(record.id, location);
    requireValue(!result.has(record.id), location, `duplicate ID ${record.id}`);
    result.set(record.id, record);
  }
  return result;
}

export function safeUrl(value, location) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${location}: invalid URL`);
  }
  requireValue(url.protocol === "https:", location, "URLs must use HTTPS");
  return value;
}

export function validateMetadata(record, location) {
  requireValue(record.schemaVersion === 1, location, "unsupported schemaVersion");
  requireId(record.id, location);
  requireText(record.title, location);
  requireValue(
    ["ready", "soon"].includes(record.status),
    location,
    "status must be ready or soon",
  );
}

export function validateBlocks(blocks, assets, location) {
  requireValue(
    Array.isArray(blocks) && blocks.length > 0,
    location,
    "add at least one content block",
  );
  for (const [index, block] of blocks.entries()) {
    const at = `${location}, block ${index + 1}`;
    switch (block.type) {
      case "paragraph":
        requireText(block.text, at);
        break;
      case "callout":
        requireText(block.title, at);
        requireText(block.text, at);
        break;
      case "list":
        requireValue(
          Array.isArray(block.items) && block.items.length > 0,
          at,
          "list needs items",
        );
        block.items.forEach((item) => requireText(item, at));
        break;
      case "table":
        requireText(block.caption, at);
        requireValue(
          Array.isArray(block.columns) && block.columns.length > 0,
          at,
          "table needs columns",
        );
        block.columns.forEach((column) => requireText(column, at));
        requireValue(
          Array.isArray(block.rows) && block.rows.length > 0,
          at,
          "table needs rows",
        );
        for (const row of block.rows) {
          requireValue(
            Array.isArray(row) && row.length === block.columns.length,
            at,
            "table row must match column count",
          );
          row.forEach((cell) => requireText(cell, at));
        }
        break;
      case "image":
        requireValue(assets.has(block.assetId), at, `unknown image ${block.assetId}`);
        requireText(block.alt, at);
        requireText(block.caption, at);
        break;
      default:
        throw new Error(`${at}: unsupported block type ${block.type}`);
    }
  }
}

export function validateLesson(lesson, bank, sourceMap, assets, framework, location) {
  validateMetadata(lesson, location);
  requireValue(
    Number.isInteger(lesson.order) && lesson.order > 0,
    location,
    "order must be a positive integer",
  );
  for (const field of ["code", "period", "summary", "bigIdea", "context"])
    requireText(lesson[field], `${location}.${field}`);
  requireValue(
    Number.isFinite(lesson.minutes) && lesson.minutes > 0,
    location,
    "minutes must be positive",
  );
  requireValue(
    Array.isArray(lesson.learningGoals) && lesson.learningGoals.length > 0,
    location,
    "add learningGoals",
  );
  lesson.learningGoals.forEach((goal) => requireText(goal, location));
  const themes = new Set((framework?.themes || []).map((theme) => theme.id));
  const sections = uniqueById(lesson.sections, `${location}.sections`);
  requireValue(sections.size > 0, location, "add a lesson section");
  const reservedAnchors = new Set([
    "learn",
    "reading-guide",
    "terms",
    "connections",
    "practice",
    "writing",
  ]);
  for (const section of sections.values()) {
    requireValue(
      !reservedAnchors.has(section.id),
      location,
      `reserved section ID ${section.id}`,
    );
    requireText(section.title, location);
    requireText(section.conceptTitle, location);
    requireText(section.takeaway, location);
    validateBlocks(section.blocks, assets, `${location}.${section.id}`);
    for (const lens of section.lenses || [])
      requireValue(themes.has(lens), location, `unknown framework lens ${lens}`);
  }
  requireValue(
    Array.isArray(lesson.sourceIds) && lesson.sourceIds.length > 0,
    location,
    "add source references",
  );
  for (const id of lesson.sourceIds)
    requireValue(sourceMap.has(id), location, `unknown source ${id}`);
  for (const term of lesson.vocabulary || []) {
    requireText(term.term, location);
    requireText(term.definition, location);
  }
  for (const connection of lesson.connections || []) {
    requireText(connection.title, location);
    requireText(connection.body, location);
  }
  uniqueById(lesson.vocabulary || [], `${location}.vocabulary`);
  uniqueById(lesson.connections || [], `${location}.connections`);
  if (lesson.readingGuide) {
    requireText(lesson.readingGuide.readingLabel, location);
    requireValue(
      Array.isArray(lesson.readingGuide.prompts) &&
        lesson.readingGuide.prompts.length > 0,
      location,
      "reading guide needs prompts",
    );
    lesson.readingGuide.prompts.forEach((prompt) => requireText(prompt, location));
    for (const lens of lesson.readingGuide.lenses || [])
      requireValue(themes.has(lens), location, `unknown reading-guide lens ${lens}`);
  }
  const questions = uniqueById(bank.questions, `${location}.questions`);
  uniqueById(bank.quizzes, `${location}.quizzes`);
  for (const question of questions.values()) {
    requireValue(
      question.topicId === lesson.id,
      location,
      `wrong topicId on ${question.id}`,
    );
    requireValue(
      sections.has(question.concept),
      location,
      `missing review section for ${question.id}`,
    );
    requireText(question.prompt, location);
    requireText(question.explanation, location);
    requireText(question.skillTag, location);
    requireValue(
      Array.isArray(question.choices) && question.choices.length === 4,
      location,
      `${question.id} needs four choices`,
    );
    question.choices.forEach((choice) => requireText(choice, location));
    requireValue(
      new Set(question.choices).size === question.choices.length,
      location,
      `${question.id} has duplicate choices`,
    );
    requireValue(
      Number.isInteger(question.correctAnswer) &&
        question.correctAnswer >= 0 &&
        question.correctAnswer < question.choices.length,
      location,
      `invalid answer on ${question.id}`,
    );
    if (question.stimulusBlocks)
      validateBlocks(question.stimulusBlocks, assets, location);
  }
  for (const quiz of bank.quizzes) {
    requireText(quiz.title, location);
    requireValue(
      quiz.topicId === lesson.id &&
        quiz.unitId === lesson.unitId &&
        quiz.courseId === lesson.courseId,
      location,
      `incorrect quiz ownership on ${quiz.id}`,
    );
    requireValue(
      ["topic", "quick"].includes(quiz.quizType),
      location,
      "unknown quizType",
    );
    validateSelections(quiz.questionIds, questions, `${location}.${quiz.id}`);
  }
  if (lesson.status === "ready") {
    for (const type of ["topic", "quick"])
      requireValue(
        bank.quizzes.filter((quiz) => quiz.quizType === type).length === 1,
        location,
        `ready topic needs one ${type} quiz`,
      );
  }
}

export function validateSelections(ids, questionMap, location) {
  requireValue(
    Array.isArray(ids) && ids.length > 0,
    location,
    "quiz must select questions",
  );
  requireValue(new Set(ids).size === ids.length, location, "duplicate selected question");
  for (const id of ids)
    requireValue(questionMap.has(id), location, `unknown question ${id}`);
}

export function validateWriting(quiz, topics, framework, unit, location) {
  requireId(quiz.id, location);
  requireValue(quiz.unitId === unit.id, location, "wrong unitId");
  requireValue(quiz.courseId === unit.courseId, location, "wrong writing courseId");
  requireValue(
    Number.isInteger(quiz.version) && quiz.version > 0,
    location,
    "version must be a positive integer",
  );
  for (const field of [
    "title",
    "prompt",
    "instructions",
    "headline",
    "promptTitle",
    "note",
  ])
    requireText(quiz[field], location);
  const parts = uniqueById(quiz.parts, location);
  requireValue(parts.size > 0, location, "writing quiz needs parts");
  requireValue(
    Array.isArray(quiz.scaffold) && quiz.scaffold.length > 0,
    location,
    "add a writing scaffold",
  );
  for (const step of quiz.scaffold) {
    requireText(step.label, location);
    requireText(step.text, location);
  }
  const themes = new Set((framework?.themes || []).map((theme) => theme.id));
  for (const part of parts.values()) {
    requireText(part.prompt, location);
    requireText(part.alternatives, location);
    for (const lens of part.lenses || [])
      requireValue(themes.has(lens), location, `unknown writing lens ${lens}`);
    requireValue(
      Array.isArray(part.criteria) && part.criteria.length > 0,
      location,
      "add review criteria",
    );
    part.criteria.forEach((criterion) => requireText(criterion, location));
    for (const key of ["answer", "prove", "explain"])
      requireText(part.model?.[key], location);
    for (const review of part.review || []) {
      const topic = topics.get(review.topicId);
      requireValue(
        topic?.lesson.status === "ready" &&
          topic.lesson.sections.some((section) => section.id === review.sectionId),
        location,
        `broken review destination ${review.topicId}/${review.sectionId}`,
      );
      requireText(review.label, location);
    }
  }
}
