import { escapeHtml as esc, link, breadcrumbs, contextCrumbs } from "../ui.js";
import { renderTable } from "../blocks.js";
import { frameworkGuide, writingInvite } from "./framework.js";

export function studyGuidePage(data) {
  const { unit, guide, topics, sources, framework } = data;
  return `<div class="container study-guide">${breadcrumbs(contextCrumbs(data, "Study guide"))}
    <header class="page-intro"><p class="eyebrow">UNIT ${unit.number} / ${esc(unit.period)}</p>
      <h1>${esc(guide.headline)}</h1><p>${esc(guide.essential)}</p>
      <div class="actions">
        ${unit.quizzes.map((quiz) => link(`/quiz/${quiz.id}`, esc(quiz.title), "btn")).join("")}
        ${unit.writingQuizzes.map((quiz) => link(`/writing/${quiz.id}`, "Write an SAQ", "btn secondary")).join("")}
      </div>
    </header>
    <section class="guide-surface"><h2>Start with the timeline.</h2><dl class="guide-timeline">
      ${guide.timeline.map((item) => `<div><dt>${esc(item.date)}</dt><dd>${esc(item.text)}</dd></div>`).join("")}
    </dl></section>
    <section class="guide-surface"><h2>Compare the same feature.</h2><p>These are starting points. Support your comparison with a named example from each society.</p>
      ${renderTable(guide.comparisons)}${frameworkGuide(framework)}
    </section>
    <section class="guide-surface"><h2>Check your understanding.</h2><div class="guide-topic-list">
      ${topics
        .map(
          (
            topic,
          ) => `<article><p class="eyebrow">TOPIC ${esc(topic.code)}${topic.readingGuide?.objectives ? ` / OBJECTIVES ${esc(topic.readingGuide.objectives)}` : ""}</p>
        <h3>${link(`/topic/${topic.id}`, esc(topic.title))}</h3><p>${esc(topic.bigIdea)}</p>
        <ul>${(topic.readingGuide?.prompts || []).map((prompt) => `<li>${esc(prompt)}</li>`).join("")}</ul>
        ${link(`/topic/${topic.id}${topic.readingGuide ? "?section=reading-guide" : ""}`, "Open lesson and reading guide", "text-link")}
      </article>`,
        )
        .join("")}
    </div></section>
    <section class="guide-surface"><h2>Keep your claims precise.</h2><ul class="guide-pitfalls">${guide.pitfalls.map((text) => `<li>${esc(text)}</li>`).join("")}</ul></section>
    ${writingInvite(unit)}
    <section class="guide-surface resource-section"><h2>Read and watch further.</h2><p>Course readings anchor the notes. These resources offer further context and review. Linked videos are optional.</p>
      <div class="resource-list">${sources.map((source) => `<article>${source.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a>` : `<strong>${esc(source.label)}</strong>`}<p>${esc(source.note)}</p></article>`).join("")}</div>
      <p class="muted">All Page One questions and study explanations are original. Source PDFs and commercial question banks are not reproduced.</p>
    </section>
  </div>`;
}
