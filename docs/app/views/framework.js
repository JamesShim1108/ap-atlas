import { escapeHtml as esc } from "../ui.js";

export function frameworkBadges(ids = [], framework) {
  if (!framework || !ids.length) return "";
  return `<div class="inspect-badges" aria-label="${esc(framework.name)} lenses">
    ${ids
      .map((id) => {
        const theme = framework.themes.find((item) => item.id === id);
        return `<span title="${esc(theme.title)}"><b>${esc(id)}</b> ${esc(theme.shortTitle)}</span>`;
      })
      .join("")}
  </div>`;
}

export function frameworkGuide(framework) {
  if (!framework) return "";
  return `<details class="inspect-guide">
    <summary>${esc(framework.title)}</summary><p>${esc(framework.intro)}</p>
    <dl>${framework.themes
      .map(
        (theme) => `
      <div><dt><span>${esc(theme.id)}</span>${esc(theme.title)}</dt>
      <dd>${esc(theme.question)}<br><small>${esc(theme.example)}</small></dd></div>
    `,
      )
      .join("")}</dl><p class="muted">${esc(framework.sourceNote)}</p>
  </details>`;
}

export function writingInvite(unit) {
  if (!unit.writingQuizzes?.length) return "";
  return `<section class="writing-invite" id="writing">
    <p class="eyebrow">SHORT ANSWER / UNIT ${unit.number}</p>
    <h2>Make the evidence count.</h2>
    <p>Write your response, then use the criteria and annotated examples to review your reasoning.</p>
    ${unit.writingQuizzes.map((quiz) => `<a class="btn" href="#/writing/${esc(quiz.id)}">${esc(quiz.title)}</a>`).join(" ")}
    <p class="muted">Answer · Prove · Explain</p>
  </section>`;
}

export function sourceList(sources) {
  return sources
    .map(
      (source) =>
        `<li>${source.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a>` : esc(source.label)}</li>`,
    )
    .join("");
}
