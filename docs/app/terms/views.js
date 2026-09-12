import { escapeHtml as esc, breadcrumbs, contextCrumbs, link, arrow } from "../ui.js";

export function termsIndexPage({ course, unit }) {
  return `<div class="container terms-page">${breadcrumbs(contextCrumbs({ course, unit }, "Terms"))}
    <header class="study-heading"><p class="eyebrow">Unit ${unit.number} · Terms</p><h1>Choose your term set.</h1>
      <p>Review the full list or get straight to flashcards. Class definitions, kept exactly as provided.</p></header>
    <div class="term-set-grid">${unit.termSets
      .map(
        (
          set,
        ) => `<a class="term-set-card" href="#/term-set/${esc(set.id)}?unit=${esc(unit.id)}">
      <span class="eyebrow">${set.count} terms</span><h2>${esc(set.title)}</h2><p>Term list · Flashcards · Know / Don’t Know</p><span class="text-link">Open set ${arrow}</span>
    </a>`,
      )
      .join("")}</div>
    ${unit.termSets.length ? "" : `<div class="study-empty"><h2>No class term sets yet</h2><p>Terms will appear here when the required class list is added. We won’t substitute vocabulary from other sources.</p>${link(`/unit/${unit.id}`, "Back to study hub", "btn secondary")}</div>`}
  </div>`;
}

const control = (id, label, extra = "", cls = "btn secondary") =>
  `<button type="button" id="terms-${id}" data-terms-action="${id}" class="${cls}" ${extra}>${label}</button>`;

export function termSetPage(data, engine, view) {
  const { course, unit, set } = data;
  const { state } = engine;
  const crumbs = contextCrumbs({ course, unit });
  crumbs.push(["Terms", `/terms/${unit.id}`], [set.title]);
  const path = `/term-set/${set.id}?unit=${unit.id}`;
  return `<div class="container terms-page">${breadcrumbs(crumbs)}
    <header class="study-heading"><p class="eyebrow">${set.cards.length} terms · Class vocabulary</p><h1>${esc(set.title)}</h1></header>
    <nav class="terms-tabs" aria-label="Study this term set">
      <a href="#${esc(path)}" ${view.mode === "cards" ? 'aria-current="page"' : ""}>Flashcards</a>
      <a href="#${esc(path)}&view=list" ${view.mode === "list" ? 'aria-current="page"' : ""}>Term List</a>
    </nav>
    ${view.mode === "list" ? termList(set) : flashcards(engine, view)}
    <p class="terms-source">Source: ${esc(set.source)}. Wording is preserved from your class list.</p>
  </div>`;
}

function termList(set) {
  return `<section aria-label="Complete term list"><div class="section-heading"><h2>All ${set.cards.length} terms</h2><span class="muted">Original order</span></div>
    <dl class="terms-list">${set.cards.map((card, index) => `<div class="terms-list__row"><dt><span class="term-number" aria-hidden="true">${index + 1}</span>${esc(card.term)}</dt><dd>${esc(card.definition)}</dd></div>`).join("")}</dl></section>`;
}

function flashcards(engine, view) {
  const { state } = engine,
    card = engine.current(),
    counts = engine.counts();
  const filterName = {
    all: "All cards",
    unknown: "Don’t Know only",
    remaining: "Remaining only",
  }[state.filter];
  const face = state.front;
  const back = face === "term" ? "definition" : "term";
  const resetPrompt = view.confirmReset
    ? `<div class="terms-reset" role="alert"><p>Clear Know / Don’t Know for this set and restart all cards?</p><div class="actions">${control("confirm-reset", "Yes, reset progress")}${control("cancel-reset", "Cancel")}</div></div>`
    : "";
  return `<section class="flashcard-workspace" aria-label="Flashcards">
    <div class="terms-counts" aria-label="Set progress"><span>Know: <strong>${counts.known}</strong></span><span>Don’t Know: <strong>${counts.unknown}</strong></span><span>Remaining: <strong>${counts.remaining}</strong></span></div>
    <div class="flashcard-toolbar"><span>${filterName}</span><span id="terms-position" role="status">${state.order.length ? Math.min(state.index + 1, state.order.length) : 0} / ${state.order.length}</span>
      <details class="terms-settings" ${view.settingsOpen ? "open" : ""}><summary id="terms-settings-toggle">Settings</summary><div class="terms-settings__body">
        <label for="terms-front">Card front</label><select id="terms-front"><option value="term" ${face === "term" ? "selected" : ""}>Term</option><option value="definition" ${face === "definition" ? "selected" : ""}>Definition</option></select>
        <label class="terms-checkbox"><input type="checkbox" id="terms-shuffle" ${state.shuffle ? "checked" : ""}> Shuffle order</label>
        <label for="terms-filter">Cards to study</label><select id="terms-filter">${[
          ["all", "Study all"],
          ["unknown", "Study only Don’t Know"],
          ["remaining", "Continue remaining"],
        ]
          .map(
            ([value, label]) =>
              `<option value="${value}" ${state.filter === value ? "selected" : ""}>${label}</option>`,
          )
          .join("")}</select>
        <div class="terms-settings__actions">${control("restart", "Restart session")}${control("reset", "Reset progress")}</div>
        <small>Restart keeps classifications. Reset clears them. Shuffle never changes the original list.</small>
      </div></details>
    </div>${resetPrompt}
    ${
      card
        ? `<div class="flashcard-stage"><button type="button" id="terms-flip" class="flashcard ${state.flipped ? "is-flipped" : ""}" data-terms-action="flip" aria-label="Flip flashcard" aria-describedby="terms-readable terms-flip-hint" aria-pressed="${state.flipped}">
      <span class="flashcard__inner"><span class="flashcard__face" aria-hidden="true"><span class="eyebrow">${face === "term" ? "Term" : "Definition"}</span><span class="flashcard__text ${face === "definition" ? "is-definition" : ""}">${esc(card[face])}</span></span>
      <span class="flashcard__face flashcard__face--back" aria-hidden="true"><span class="eyebrow">${back === "term" ? "Term" : "Definition"}</span><span class="flashcard__text ${back === "definition" ? "is-definition" : ""}">${esc(card[back])}</span></span></span></button>
      <p id="terms-readable" class="visually-hidden" aria-live="polite">${esc(card[state.flipped ? back : face])}</p>
    </div><p id="terms-flip-hint" class="flashcard-hint">Tap card to flip · ${state.classifications[card.id] === "known" ? "Marked Know" : state.classifications[card.id] === "unknown" ? "Marked Don’t Know" : "Not classified yet"}</p>
    <div class="flashcard-classify">${control("unknown", "Don’t Know", 'aria-keyshortcuts="1"', "btn secondary")}${control("known", "Know", 'aria-keyshortcuts="2"', "btn")}</div>
    <div class="flashcard-navigation">${control("previous", "← Previous", state.index === 0 ? "disabled" : "")}<span class="muted">Classifying advances the card</span>${control("next", "Next →")}</div>`
        : `<div id="terms-complete" class="study-empty" role="status" tabindex="-1"><p class="eyebrow">${state.order.length ? "Round finished" : "Nothing in this view"}</p><h2>${state.order.length ? "Choose your next round." : state.filter === "unknown" ? "No Don’t Know cards yet." : "No remaining cards."}</h2>
      <p>${counts.remaining ? `${counts.remaining} terms still haven’t been classified.` : "Every term has a classification. You can keep reviewing at any time."}</p>
      <div class="actions">${counts.unknown ? control("study-unknown", `Review Don’t Know (${counts.unknown})`, "", "btn") : ""}${counts.remaining ? control("study-remaining", `Continue remaining (${counts.remaining})`) : ""}${control("study-all", "Restart all cards")}${state.order.length ? control("previous", "Previous card") : ""}</div></div>`
    }
    <p class="terms-shortcuts">Keyboard: focus the card and press Space to flip · ← / → to move · 1 Don’t Know · 2 Know</p>
    <p class="terms-save-note">${view.storageOK ? "Progress stays in this browser tab for this session." : "Browser storage is unavailable. Progress is kept on this page until it is reloaded."}</p>
  </section>`;
}
