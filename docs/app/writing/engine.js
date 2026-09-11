export const maxResponseLength = 10000;

export function createWritingEngine(quiz) {
  const partIds = quiz.parts.map((part) => part.id);
  const emptyScores = () => Object.fromEntries(partIds.map((id) => [id, null]));

  function newDraft() {
    return {
      version: quiz.version,
      quizId: quiz.id,
      responses: Object.fromEntries(partIds.map((id) => [id, ""])),
      reviewed: false,
      scores: emptyScores(),
    };
  }

  function validate(draft) {
    if (
      !draft ||
      draft.version !== quiz.version ||
      draft.quizId !== quiz.id ||
      typeof draft.reviewed !== "boolean"
    )
      return false;
    for (const value of [draft.responses, draft.scores]) {
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        Object.keys(value).length !== partIds.length
      )
        return false;
    }
    if (
      !partIds.every(
        (id) =>
          typeof draft.responses[id] === "string" &&
          draft.responses[id].length <= maxResponseLength &&
          [null, 0, 1].includes(draft.scores[id]),
      )
    )
      return false;
    if (draft.reviewed && !partIds.every((id) => draft.responses[id].trim()))
      return false;
    return draft.reviewed || partIds.every((id) => draft.scores[id] === null);
  }

  function updateResponse(draft, partId, text) {
    if (
      !partIds.includes(partId) ||
      typeof text !== "string" ||
      text.length > maxResponseLength ||
      draft.reviewed
    )
      return false;
    draft.responses[partId] = text;
    draft.scores = emptyScores();
    return true;
  }

  function review(draft) {
    if (!partIds.every((id) => draft.responses[id].trim())) return false;
    draft.reviewed = true;
    return true;
  }

  function revise(draft) {
    draft.reviewed = false;
    draft.scores = emptyScores();
  }

  function setScore(draft, partId, value) {
    if (!draft.reviewed || !partIds.includes(partId) || ![0, 1].includes(value))
      return false;
    draft.scores[partId] = value;
    return true;
  }

  function total(draft) {
    if (!draft.reviewed || !partIds.every((id) => draft.scores[id] !== null)) return null;
    return partIds.reduce((sum, id) => sum + draft.scores[id], 0);
  }
  return { newDraft, validate, updateResponse, review, revise, setScore, total };
}
