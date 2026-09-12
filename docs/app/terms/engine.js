// Pure study logic. A session orders IDs, never copies or edits source definitions.
export function createTermsEngine(set, saved = null, random = Math.random) {
  const cards = new Map(set.cards.map((card) => [card.id, card]));
  const sourceIds = [...cards.keys()];
  const filters = ["all", "unknown", "remaining"];
  const state = {
    revision: set.revision,
    classifications: {},
    order: [],
    index: 0,
    filter: "all",
    shuffle: false,
    front: "term",
    flipped: false,
  };

  function start(filter = state.filter) {
    state.filter = filters.includes(filter) ? filter : "all";
    state.order = sourceIds.filter((id) =>
      state.filter === "unknown"
        ? state.classifications[id] === "unknown"
        : state.filter === "remaining"
          ? !state.classifications[id]
          : true,
    );
    if (state.shuffle) {
      for (let i = state.order.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [state.order[i], state.order[j]] = [state.order[j], state.order[i]];
      }
    }
    state.index = 0;
    state.flipped = false;
  }

  if (saved && saved.revision === set.revision) {
    if (saved.front === "definition") state.front = saved.front;
    state.shuffle = saved.shuffle === true;
    if (filters.includes(saved.filter)) state.filter = saved.filter;
    for (const [id, status] of Object.entries(saved.classifications || {})) {
      if (cards.has(id) && ["known", "unknown"].includes(status))
        state.classifications[id] = status;
    }
  }
  start();
  // A filtered queue is a snapshot: classifying a card must not shift the next
  // card's index or make Previous skip it. The next round refreshes membership.
  if (
    saved?.revision === set.revision &&
    Array.isArray(saved.order) &&
    saved.order.every((id) => cards.has(id)) &&
    new Set(saved.order).size === saved.order.length &&
    (state.filter !== "all" || saved.order.length === sourceIds.length) &&
    Number.isInteger(saved.index) &&
    saved.index >= 0 &&
    saved.index <= saved.order.length
  ) {
    state.order = [...saved.order];
    state.index = saved.index;
  }

  function current() {
    return cards.get(state.order[state.index]) || null;
  }
  function move(offset) {
    state.index = Math.min(state.order.length, Math.max(0, state.index + offset));
    state.flipped = false;
  }
  function classify(status) {
    if (!current() || !["known", "unknown"].includes(status)) return;
    state.classifications[current().id] = status;
    move(1);
  }
  function counts() {
    const values = Object.values(state.classifications);
    const known = values.filter((value) => value === "known").length;
    const unknown = values.filter((value) => value === "unknown").length;
    return {
      known,
      unknown,
      remaining: sourceIds.length - known - unknown,
      total: sourceIds.length,
    };
  }
  return {
    state,
    current,
    counts,
    start,
    move,
    classify,
    flip() {
      if (current()) state.flipped = !state.flipped;
    },
    setFront(front) {
      if (["term", "definition"].includes(front)) state.front = front;
      state.flipped = false;
    },
    setShuffle(enabled) {
      state.shuffle = Boolean(enabled);
      start();
    },
    reset() {
      state.classifications = {};
      start("all");
    },
    snapshot() {
      const { flipped, ...persistent } = state;
      return structuredClone(persistent);
    },
  };
}
