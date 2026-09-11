import { createWritingEngine } from "./engine.js";

export function createWritingStore(quiz, getStorage = () => sessionStorage) {
  const key = `page-one-writing:${quiz.id}:v${quiz.version}`;
  const engine = createWritingEngine(quiz);
  let draft = engine.newDraft(),
    storageOK = true;
  try {
    // The original single-quiz key remains readable during this migration.
    const saved = JSON.parse(
      getStorage().getItem(key) || getStorage().getItem("page-one-writing-v1") || "null",
    );
    if (engine.validate(saved)) draft = saved;
  } catch {
    storageOK = false;
  }

  function save() {
    try {
      getStorage().setItem(key, JSON.stringify(draft));
      storageOK = true;
    } catch {
      storageOK = false;
    }
    return storageOK;
  }
  return {
    engine,
    save,
    get draft() {
      return draft;
    },
    get storageOK() {
      return storageOK;
    },
  };
}
