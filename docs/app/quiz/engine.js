// This engine receives one loaded bank. It never imports the complete course catalog.
export function createQuizEngine(bank) {
  const questionById = Object.assign(
    Object.create(null),
    Object.fromEntries(bank.questions.map((question) => [question.id, question])),
  );
  const quizById = Object.assign(
    Object.create(null),
    Object.fromEntries(bank.quizzes.map((quiz) => [quiz.id, quiz])),
  );

  function createAttempt(quizId, questionIds = null, mode = "topic") {
    const quiz = quizById[quizId];
    if (!quiz) return null;
    const selected = (questionIds ?? quiz.questionIds).filter((id) =>
      quiz.questionIds.includes(id),
    );
    if (!selected.length) return null;
    return {
      version: 1,
      quizId,
      mode,
      ids: shuffle([...new Set(selected)]),
      index: 0,
      answers: {},
      complete: false,
    };
  }

  function checkAnswer(attempt, choice) {
    if (!attempt || attempt.complete) return false;
    const id = attempt.ids[attempt.index],
      question = questionById[id];
    if (
      !question ||
      Object.hasOwn(attempt.answers, id) ||
      !Number.isInteger(choice) ||
      choice < 0 ||
      choice >= question.choices.length
    )
      return false;
    attempt.answers[id] = choice;
    return true;
  }

  function nextQuestion(attempt) {
    if (
      !attempt ||
      attempt.complete ||
      !Object.hasOwn(attempt.answers, attempt.ids[attempt.index])
    )
      return false;
    if (attempt.index === attempt.ids.length - 1) attempt.complete = true;
    else attempt.index += 1;
    return true;
  }

  function summarize(attempt) {
    const tags = {};
    let correct = 0;
    for (const id of attempt.ids) {
      if (!Object.hasOwn(attempt.answers, id)) continue;
      const question = questionById[id];
      const hit = attempt.answers[id] === question.correctAnswer;
      const key = `${question.topicId}/${question.concept}`;
      correct += Number(hit);
      tags[key] ??= { correct: 0, total: 0 };
      tags[key].total += 1;
      tags[key].correct += Number(hit);
    }
    const strong = Object.keys(tags).filter(
      (key) => tags[key].correct / tags[key].total >= 0.75,
    );
    const weak = Object.keys(tags).filter((key) => !strong.includes(key));
    return {
      correct,
      total: attempt.ids.length,
      percent: Math.round((correct / attempt.ids.length) * 100),
      tags,
      strong,
      weak,
    };
  }

  function weakQuestionIds(attempt) {
    const weak = summarize(attempt).weak;
    return quizById[attempt.quizId].questionIds.filter((id) => {
      const question = questionById[id];
      return weak.includes(`${question.topicId}/${question.concept}`);
    });
  }

  function validateAttempt(attempt) {
    if (!attempt || attempt.version !== 1 || !quizById[attempt.quizId]) return false;
    const quiz = quizById[attempt.quizId];
    if (
      !["topic", "quick", "weak"].includes(attempt.mode) ||
      !Array.isArray(attempt.ids) ||
      !attempt.ids.length ||
      new Set(attempt.ids).size !== attempt.ids.length
    )
      return false;
    if (!attempt.ids.every((id) => quiz.questionIds.includes(id) && questionById[id]))
      return false;
    if (
      !Number.isInteger(attempt.index) ||
      attempt.index < 0 ||
      attempt.index >= attempt.ids.length ||
      typeof attempt.complete !== "boolean"
    )
      return false;
    if (
      !attempt.answers ||
      typeof attempt.answers !== "object" ||
      Array.isArray(attempt.answers)
    )
      return false;
    if (
      attempt.mode !== "weak" &&
      (attempt.ids.length !== quiz.questionIds.length ||
        (attempt.mode === "quick") !== (quiz.quizType === "quick"))
    )
      return false;
    if (attempt.mode === "weak" && !["topic", "unit"].includes(quiz.quizType))
      return false;
    if (
      !Object.entries(attempt.answers).every(
        ([id, choice]) =>
          attempt.ids.includes(id) &&
          Number.isInteger(choice) &&
          choice >= 0 &&
          choice < questionById[id].choices.length,
      )
    )
      return false;
    if (
      !attempt.ids
        .slice(0, attempt.index)
        .every((id) => Object.hasOwn(attempt.answers, id))
    )
      return false;
    if (
      attempt.ids
        .slice(attempt.index + 1)
        .some((id) => Object.hasOwn(attempt.answers, id))
    )
      return false;
    if (
      attempt.complete &&
      (attempt.index !== attempt.ids.length - 1 ||
        Object.keys(attempt.answers).length !== attempt.ids.length)
    )
      return false;
    return true;
  }

  const concepts = Object.fromEntries(
    Object.values(bank.concepts).map((concept) => [
      `${concept.topicId}/${concept.id || concept.section}`,
      concept,
    ]),
  );
  return {
    questionById,
    quizById,
    concepts,
    createAttempt,
    checkAnswer,
    nextQuestion,
    summarize,
    weakQuestionIds,
    validateAttempt,
  };
}

export function shuffle(ids) {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}
