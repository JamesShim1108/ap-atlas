import { escapeHtml as esc, link, breadcrumbs, contextCrumbs, quizEntry } from "../ui.js";
import { renderBlocks } from "../blocks.js";
import {
  frameworkBadges,
  frameworkGuide,
  sourceList,
  writingInvite,
} from "./framework.js";

function readingGuide(lesson, framework) {
  const guide = lesson.readingGuide;
  if (!guide) return "";
  return `<section class="lesson-section reading-guide" id="reading-guide">
    <h2><span class="section-number">READING GUIDE</span>Read, then explain.</h2>
    <p class="muted">Companion prompts for ${esc(guide.readingLabel)}. Use your own reading copy alongside these original notes.</p>
    ${frameworkBadges(guide.lenses, framework)}
    <ol>${guide.prompts.map((prompt) => `<li>${esc(prompt)}</li>`).join("")}</ol>${frameworkGuide(framework)}
  </section>`;
}

function lessonSection(section, framework, assets) {
  return `<div class="concept" id="${esc(section.id)}">
    <h3>${esc(section.title)}</h3>${frameworkBadges(section.lenses, framework)}
    ${renderBlocks(section.blocks, assets)}
    <p class="note"><strong>Remember:</strong> ${esc(section.takeaway)}</p>
  </div>`;
}

export function lessonPage(data, quizController) {
  const { lesson, unit, framework, bank, sources, assets } = data;
  const quiz = bank.quizzes.find((item) => item.quizType === "topic");
  const quick = bank.quizzes.find((item) => item.quizType === "quick");
  const entry = () => quizEntry(quiz, quizController.attempt(quiz.id));
  const crumbs = contextCrumbs(data);
  crumbs[crumbs.length - 1] = [`Topic ${lesson.code}`];
  const sections = [
    ["learn", "Learn"],
    ...(lesson.readingGuide ? [["reading-guide", "Reading guide"]] : []),
    ["terms", "Key terms"],
    ["connections", "Connections"],
    ["practice", "Quick practice"],
    ...(unit.writingQuizzes.length ? [["writing", "Writing quiz"]] : []),
  ];
  return `<div class="container">${breadcrumbs(crumbs)}<div class="lesson-grid">
    <aside class="lesson-nav" aria-label="Lesson sections"><p class="eyebrow">On this page</p>
      ${sections.map(([id, label]) => link(`/topic/${lesson.id}?section=${id}`, label)).join("")}${entry()}
      <p class="nav-note">${quiz.questionIds.length} questions · Explanations included<br>No timer. Take your time.</p>
    </aside>
    <article><header class="lesson-head"><p class="eyebrow">Topic ${esc(lesson.code)} · ${esc(unit.title)}</p>
      <h1>${esc(lesson.title)}</h1><p class="date-line">${esc(lesson.period)}</p><p class="lede">${esc(lesson.summary)}</p>
      <div class="lesson-meta"><span>About ${lesson.minutes} min to read</span><span>${lesson.vocabulary.length} key terms</span><span>Original lesson</span></div>
    </header>
    <div class="lesson-goals"><p class="eyebrow">What you should be able to explain</p>
      <ul>${lesson.learningGoals.map((goal) => `<li>${esc(goal)}</li>`).join("")}</ul>
      ${lesson.readingGuide?.objectives ? `<small>Unit ${unit.number} learning objectives ${esc(lesson.readingGuide.objectives)}</small>` : ""}
    </div>
    <div class="big-idea"><p class="eyebrow">The big idea</p><p>${esc(lesson.bigIdea)}</p></div>
    <section class="lesson-section" id="learn"><h2><span class="section-number">01 / LEARN</span>Understand the story.</h2>
      <p class="note"><strong>Place it in time.</strong> ${esc(lesson.context)}</p>
      ${lesson.sections.map((section) => lessonSection(section, framework, assets)).join("")}
    </section>
    ${readingGuide(lesson, framework)}
    <section class="lesson-section" id="terms"><h2><span class="section-number">02 / KEY TERMS</span>Words worth knowing.</h2>
      <dl class="terms">${lesson.vocabulary.map((term) => `<div class="term-row"><dt>${esc(term.term)}</dt><dd>${esc(term.definition)}</dd></div>`).join("")}</dl>
    </section>
    <section class="lesson-section" id="connections"><h2><span class="section-number">03 / CONNECTIONS</span>Go beyond the facts.</h2>
      <div class="connection-list">${lesson.connections.map((connection) => `<div class="connection"><p class="eyebrow">${esc(connection.type)}</p><h3>${esc(connection.title)}</h3><p>${esc(connection.body)}</p></div>`).join("")}</div>
    </section>
    <section class="lesson-section" id="practice"><h2><span class="section-number">04 / QUICK PRACTICE</span>Check what stuck.</h2>
      <p class="muted">${quick.questionIds.length} short questions before the topic quiz.</p><div class="quick-shell" id="quick-shell">${quizController.quickView(quick)}</div>
    </section>
    <section class="quiz-invite"><p class="eyebrow">Ready to put it together?</p><h2>Take the topic quiz.</h2>
      <p>${quiz.questionIds.length} questions. A clear explanation after each answer. A focused next step when you finish.</p>${entry()}
    </section>
    ${writingInvite(unit)}
    <details class="sources"><summary>About this lesson &amp; references</summary>
      <p>Original study notes and questions, informed by course readings.</p><ul>${sourceList(sources)}</ul>
      <p>The questions are original. Study scenarios are written for practice; they are not historical quotations.</p>
    </details></article>
  </div></div>`;
}
