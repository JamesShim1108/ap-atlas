import { writingPage, wordCount, saveMessage, scoreMessage } from "./views.js";

export function createWritingController(data, store, repaint) {
  const { quiz } = data,
    { engine } = store;
  function showSaved() {
    document.getElementById("writing-save").textContent = saveMessage(store);
  }

  function input(event) {
    const field = event.target.closest("textarea[data-writing-part]");
    if (!field) return false;
    if (engine.updateResponse(store.draft, field.dataset.writingPart, field.value)) {
      field.setCustomValidity("");
      store.save();
      showSaved();
      document.getElementById(`writing-${field.dataset.writingPart}-count`).textContent =
        `${wordCount(field.value)} words`;
    }
    return true;
  }

  function submit(event) {
    const form = event.target.closest(".writing-form");
    if (!form) return false;
    event.preventDefault();
    for (const part of quiz.parts) {
      const field = form.elements.namedItem(part.id);
      if (!field.value.trim()) {
        field.setCustomValidity("Write an APE response for this part before reviewing.");
        field.reportValidity();
        field.focus();
        return true;
      }
      engine.updateResponse(store.draft, part.id, field.value);
    }
    if (engine.review(store.draft)) {
      store.save();
      repaint();
      const panel = document.getElementById("writing-review");
      panel.focus({ preventScroll: true });
      panel.scrollIntoView({ block: "start" });
    }
    return true;
  }

  function change(event) {
    const field = event.target.closest("[data-writing-score]");
    if (!field) return false;
    if (engine.setScore(store.draft, field.dataset.writingScore, Number(field.value))) {
      store.save();
      showSaved();
      document.getElementById("writing-score").textContent = scoreMessage(
        store,
        quiz.parts.length,
      );
    }
    return true;
  }

  function click(event) {
    const control = event.target.closest("[data-writing-action]");
    if (!control) return false;
    if (control.dataset.writingAction === "revise") {
      engine.revise(store.draft);
      store.save();
      repaint();
      document.getElementById(`writing-${quiz.parts[0].id}`).focus();
    }
    return true;
  }
  return { page: () => writingPage(data, store), input, submit, change, click };
}
