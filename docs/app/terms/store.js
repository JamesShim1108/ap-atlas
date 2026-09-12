// Session-only progress, isolated from quiz attempts and writing drafts.
export function createTermsStore({ getStorage = () => sessionStorage } = {}) {
  const memory = new Map();
  let available = true;
  const key = (id) => `page-one-terms-v1:${id}`;
  return {
    get available() {
      return available;
    },
    load(id) {
      if (memory.has(id)) return structuredClone(memory.get(id));
      try {
        const saved = JSON.parse(getStorage().getItem(key(id)) || "null");
        return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : null;
      } catch {
        available = false;
        return null;
      }
    },
    save(id, state) {
      memory.set(id, structuredClone(state));
      try {
        getStorage().setItem(key(id), JSON.stringify(state));
      } catch {
        available = false;
      }
    },
  };
}
