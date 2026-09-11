const storageKey = "page-one-attempts-v1";

export function createAttemptStore(getStorage = () => sessionStorage) {
  let attempts = {},
    storageOK = true;
  try {
    const saved = JSON.parse(getStorage().getItem(storageKey) || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) attempts = saved;
  } catch {
    storageOK = false;
  }

  function save(attempt) {
    attempts[attempt.quizId] = attempt;
    try {
      getStorage().setItem(storageKey, JSON.stringify(attempts));
      storageOK = true;
    } catch {
      storageOK = false;
    }
  }

  function get(quizId, engine) {
    const attempt = attempts[quizId];
    // Validate only against the bank just loaded. Other courses' saves must survive.
    return attempt?.quizId === quizId && engine.validateAttempt(attempt) ? attempt : null;
  }

  function peek(quizId) {
    const attempt = attempts[quizId];
    return attempt?.quizId === quizId && typeof attempt.complete === "boolean"
      ? attempt
      : null;
  }
  function resume() {
    return Object.values(attempts).find(
      (attempt) =>
        attempt?.complete === false &&
        attempt.mode !== "quick" &&
        typeof attempt.quizId === "string",
    );
  }

  return {
    get,
    peek,
    save,
    resume,
    get storageOK() {
      return storageOK;
    },
  };
}
