import { createTermsEngine } from "./engine.js";
import { termSetPage } from "./views.js";

export function createTermsController(data, store, { repaint, mode = "cards" }) {
  const engine = createTermsEngine(data.set, store.load(data.set.id));
  const view = {
    mode,
    settingsOpen: false,
    confirmReset: false,
    storageOK: store.available,
  };

  function save() {
    store.save(data.set.id, engine.snapshot());
    view.storageOK = store.available;
  }
  function update({ closeSettings = false, focusId = null } = {}) {
    const activeId = document.activeElement?.id;
    view.settingsOpen =
      !closeSettings && (document.querySelector(".terms-settings")?.open || false);
    save();
    repaint();
    // A completed round replaces the card. Move focus to its next-step choices
    // instead of dropping keyboard users back at the top of the document.
    const focus = [focusId, activeId, "terms-flip", "terms-complete"]
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .find((element) => element && !element.disabled);
    focus?.focus({ preventScroll: true });
  }
  function act(action) {
    switch (action) {
      case "flip": {
        engine.flip();
        // Keep the same DOM node so CSS can animate between its two states.
        const button = document.getElementById("terms-flip");
        if (button) {
          button.classList.toggle("is-flipped", engine.state.flipped);
          button.setAttribute("aria-pressed", String(engine.state.flipped));
          const field = engine.state.flipped
            ? engine.state.front === "term"
              ? "definition"
              : "term"
            : engine.state.front;
          document.getElementById("terms-readable").textContent = engine.current()[field];
        }
        return true;
      }
      case "previous":
        engine.move(-1);
        break;
      case "next":
        engine.move(1);
        break;
      case "known":
      case "unknown":
        engine.classify(action);
        break;
      case "study-unknown":
        engine.start("unknown");
        break;
      case "study-remaining":
        engine.start("remaining");
        break;
      case "study-all":
        engine.start("all");
        break;
      case "restart":
        engine.start();
        break;
      case "reset":
        view.confirmReset = true;
        update({ closeSettings: true, focusId: "terms-confirm-reset" });
        return true;
      case "cancel-reset":
        view.confirmReset = false;
        update({ focusId: "terms-settings-toggle" });
        return true;
      case "confirm-reset":
        engine.reset();
        view.confirmReset = false;
        update({ closeSettings: true, focusId: "terms-flip" });
        return true;
      default:
        return false;
    }
    update();
    return true;
  }
  save();
  return {
    page: () => termSetPage(data, engine, view),
    click(event) {
      const control = event.target.closest("[data-terms-action]");
      return control ? act(control.dataset.termsAction) : false;
    },
    change(event) {
      if (event.target.id === "terms-front") engine.setFront(event.target.value);
      else if (event.target.id === "terms-shuffle")
        engine.setShuffle(event.target.checked);
      else if (event.target.id === "terms-filter") engine.start(event.target.value);
      else return false;
      update();
      return true;
    },
    keydown(event) {
      if (
        view.mode !== "cards" ||
        view.confirmReset ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.repeat ||
        event.target.closest(
          "input, select, textarea, summary, [contenteditable], .terms-settings",
        )
      )
        return;
      const action = {
        ArrowLeft: "previous",
        ArrowRight: "next",
        1: "unknown",
        2: "known",
      }[event.key];
      // Native buttons and links keep their Space/Enter behavior.
      const space = event.code === "Space" && !event.target.closest("button, a");
      if (action || space) {
        event.preventDefault();
        act(action || "flip");
      }
    },
  };
}
