import { escapeHtml as esc, link, breadcrumbs, contextCrumbs } from "../ui.js";
import { frameworkBadges, frameworkGuide } from "../views/framework.js";
import { maxResponseLength } from "./engine.js";

export const wordCount = (text) => (text.trim() ? text.trim().split(/\s+/u).length : 0);
export const saveMessage = (store) =>
  store.storageOK
    ? "Draft saved in this tab. Closing the tab ends this session."
    : "Draft kept in memory only. This browser could not save it across a reload.";

export function scoreMessage(store, partCount) {
  const total = store.engine.total(store.draft);
  return total === null
    ? "Self-check: assess every part to see your total."
    : `Your self-check: ${total} / ${partCount}. This is your assessment, not an automatic grade.`;
}

function responseField(part, draft, framework) {
  return `<section class="writing-part">
    <div class="writing-part-heading"><span class="part-letter" aria-hidden="true">${esc(part.id.toUpperCase())}</span>
      <label for="writing-${esc(part.id)}"><span class="visually-hidden">Part ${esc(part.id.toUpperCase())}. </span>${esc(part.prompt)}</label>
    </div>${frameworkBadges(part.lenses, framework)}
    <textarea id="writing-${esc(part.id)}" name="${esc(part.id)}" data-writing-part="${esc(part.id)}" rows="7"
      maxlength="${maxResponseLength}" required ${draft.reviewed ? "readonly" : ""} aria-describedby="writing-${esc(part.id)}-help"
      placeholder="Answer the question. Prove it with a specific example. Explain the connection.">${esc(draft.responses[part.id])}</textarea>
    <div class="writing-field-meta"><small id="writing-${esc(part.id)}-help">One complete APE response.</small>
      <small id="writing-${esc(part.id)}-count">${wordCount(draft.responses[part.id])} words</small>
    </div>
  </section>`;
}

function reviewPart(part, draft) {
  return `<article class="writing-review-part"><h3>Part ${esc(part.id.toUpperCase())}</h3>
    <ul>${part.criteria.map((criterion) => `<li>${esc(criterion)}</li>`).join("")}</ul>
    <details class="model-answer"><summary>Show one model APE response</summary>
      <dl>${[
        ["answer", "Answer"],
        ["prove", "Prove"],
        ["explain", "Explain"],
      ]
        .map(
          ([key, label]) =>
            `<div><dt>${label}</dt><dd>${esc(part.model[key])}</dd></div>`,
        )
        .join("")}</dl>
      <p>${esc(part.alternatives)}</p>
    </details>
    <fieldset class="self-score"><legend>Your assessment of part ${esc(part.id.toUpperCase())}</legend>
      ${[
        [1, "Meets the criteria: 1 point"],
        [0, "Needs revision: 0 points"],
      ]
        .map(
          ([value, label]) => `<label>
        <input type="radio" name="writing-score-${esc(part.id)}" data-writing-score="${esc(part.id)}" value="${value}" ${draft.scores[part.id] === value ? "checked" : ""}>${label}
      </label>`,
        )
        .join("")}
    </fieldset>
    <div class="writing-review-links">${part.review.map((review) => link(`/topic/${review.topicId}?section=${review.sectionId}`, `Review ${esc(review.label)}`)).join("")}</div>
  </article>`;
}

function reviewPanel(quiz, store) {
  if (!store.draft.reviewed) return "";
  return `<section class="writing-review" id="writing-review" tabindex="-1" aria-labelledby="writing-review-title">
    <p class="eyebrow">REVIEW / APE</p><h2 id="writing-review-title">Compare, then revise.</h2>
    <p>Each part is worth one self-assessed point. Look for a direct answer, accurate evidence, and a clear explanation. Other defensible answers can work.</p>
    <p id="writing-score" class="note" role="status">${scoreMessage(store, quiz.parts.length)}</p>
    ${quiz.parts.map((part) => reviewPart(part, store.draft)).join("")}
    <button type="button" class="btn" data-writing-action="revise">Revise responses</button>
    <p class="muted">Revising keeps your writing and clears the self-check scores.</p>
  </section>`;
}

export function writingPage(data, store) {
  const { quiz, unit, framework } = data;
  return `<div class="container writing-page">${breadcrumbs(contextCrumbs(data, "Writing quiz"))}
    <header class="writing-head"><p class="eyebrow">UNIT ${unit.number} / SHORT-ANSWER QUESTION</p>
      <h1>${esc(quiz.headline)}</h1><p class="writing-meta">1 question · ${quiz.parts.length} parts · ${quiz.parts.length} APE responses</p>
    </header>
    <div class="writing-layout"><div class="writing-paper">
      <div class="writing-prompt"><h2>${esc(quiz.promptTitle)}</h2><p>${esc(quiz.prompt)}</p></div>
      <p>${esc(quiz.instructions)}</p><div class="ape-steps">${quiz.scaffold.map((step) => `<div><b>${esc(step.label)}</b><span>${esc(step.text)}</span></div>`).join("")}</div>
      <form class="writing-form">${quiz.parts.map((part) => responseField(part, store.draft, framework)).join("")}
        <p id="writing-save" class="muted">${saveMessage(store)}</p>
        ${store.draft.reviewed ? '<p class="note">Responses are ready for review below. Choose Revise responses to edit them.</p>' : `<button class="btn" type="submit">Review my ${quiz.parts.length} responses</button><p class="writing-review-note">Reveals self-check criteria and optional model answers. No automatic grading.</p>`}
      </form>${reviewPanel(quiz, store)}
    </div><aside class="writing-sidebar">
      ${quiz.sidebar ? `<div class="side-note"><h2>${esc(quiz.sidebar.title)}</h2>${quiz.sidebar.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}${unit.hasGuide ? link(`/guide/${unit.id}`, "Open the unit study guide", "text-link") : ""}</div>` : ""}
      ${frameworkGuide(framework)}<p class="writing-disclosure">${esc(quiz.note)}</p>
    </aside></div>
  </div>`;
}
