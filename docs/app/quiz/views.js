import {
  escapeHtml as esc,
  link,
  arrow,
  quizButton,
  breadcrumbs,
  contextCrumbs,
} from "../ui.js";
import { renderBlocks } from "../blocks.js";

export function questionView(attempt, engine, assets, quick = false) {
  const id = attempt.ids[attempt.index],
    question = engine.questionById[id];
  const checked = Object.hasOwn(attempt.answers, id);
  const correct = checked && attempt.answers[id] === question.correctAnswer;
  const answered = checked ? attempt.index + 1 : attempt.index;
  const heading = quick ? "h3" : "h1";
  const concept = engine.concepts[`${question.topicId}/${question.concept}`];
  return `<div class="quiz-progress"><span>${quick ? "Quick check" : "Question"} ${attempt.index + 1} of ${attempt.ids.length}</span><span>${answered} answered</span></div>
    <div class="progress-track" role="progressbar" aria-label="Questions answered" aria-valuenow="${answered}" aria-valuemin="0" aria-valuemax="${attempt.ids.length}">
      <div class="progress-fill" style="width:${(answered / attempt.ids.length) * 100}%"></div>
    </div>
    <form class="question-card" data-quiz="${esc(attempt.quizId)}" data-question="${esc(id)}">
      <p class="question-meta">${esc(concept.title)} · ${esc(question.skillTag)}</p>
      ${question.stimulus ? `<div class="stimulus"><p class="eyebrow">Practice scenario · Written for this quiz</p><p>${esc(question.stimulus)}</p></div>` : ""}
      ${question.stimulusBlocks ? renderBlocks(question.stimulusBlocks, assets) : ""}
      <${heading} id="question-heading">${esc(question.prompt)}</${heading}>
      <fieldset class="choices" aria-labelledby="question-heading"><legend class="visually-hidden">Choose one answer</legend>
        ${question.choices.map((choice, index) => choiceView(choice, index, question, attempt, checked)).join("")}
      </fieldset>
      ${
        checked
          ? `<div class="answer-feedback ${correct ? "" : "wrong"}" id="answer-feedback" tabindex="-1" role="status">
        <h4>${correct ? "✓ Correct" : "✗ Incorrect"}</h4>
        ${correct ? "" : `<p><strong>Correct answer:</strong> ${"ABCD"[question.correctAnswer]}. ${esc(question.choices[question.correctAnswer])}</p>`}
        <p><strong>Why:</strong> ${esc(question.explanation)}</p>
      </div>`
          : ""
      }
      <div class="question-actions"><p>${checked ? "Take a moment to read the explanation." : "Choose an answer, then check it."}</p>
        ${checked ? quizButton(`${attempt.index === attempt.ids.length - 1 ? (quick ? "Finish quick check" : "See results") : "Next question"} ${arrow}`, "next", attempt.quizId, { questionId: id }) : '<button class="btn" type="submit" disabled>Check answer</button>'}
      </div>
    </form>`;
}

function choiceView(choice, index, question, attempt, checked) {
  const selected = checked && attempt.answers[question.id] === index;
  const correct = checked && index === question.correctAnswer;
  return `<label class="choice ${correct ? "correct" : selected ? "incorrect" : ""}">
    <input type="radio" name="answer" value="${index}" ${selected ? "checked" : ""} ${checked ? "disabled" : ""}>
    <span class="choice-letter" aria-hidden="true">${"ABCD"[index]}</span>
    <span><span class="visually-hidden">${"ABCD"[index]}. </span>${esc(choice)}</span>
    ${correct ? '<span class="answer-mark">✓ Correct</span>' : selected ? '<span class="answer-mark">✗ Your answer</span>' : ""}
  </label>`;
}

export function quizPage(data, attempt, engine, storageOK) {
  const { quiz, unit, topic } = data;
  const label = topic ? `Topic ${topic.code}` : `Unit ${unit.number}`;
  if (attempt?.complete) return resultsPage(data, attempt, engine);
  if (!attempt)
    return `<div class="quiz-page">${breadcrumbs(contextCrumbs(data, "Quiz"))}<div class="empty-state">
    <p class="eyebrow">${esc(label)}</p><h1>Ready when you are.</h1>
    <p>${quiz.questionIds.length} questions, one at a time. Read the explanation after each answer and see what to review at the end.</p>
    ${quiz.quizType === "unit" ? "<p>This review reuses selected topic-quiz questions.</p>" : ""}
    ${quizButton(`Start quiz ${arrow}`, "start", quiz.id)}
  </div></div>`;
  return `<div class="quiz-page">${breadcrumbs(contextCrumbs(data, attempt.mode === "weak" ? "Targeted practice" : "Quiz"))}
    <div class="quiz-context"><p>${attempt.mode === "weak" ? "Practice weak areas" : esc(quiz.title)}<br>No timer. Focus on the reasoning.</p>
      ${link(topic ? `/topic/${topic.id}` : `/unit/${unit.id}`, topic ? "Back to lesson" : "Back to unit")}
    </div><div id="quiz-shell">${questionView(attempt, engine, data.bank.assets)}</div>
    <p class="question-footnote">${storageOK ? "Your answers stay in this browser tab during this session." : "Keep this page open; this browser is not saving quiz progress."}</p>
  </div>`;
}

function resultGroup(title, keys, result, engine, needs = false) {
  return `<section class="result-panel ${needs ? "needs" : ""}"><h2><span aria-hidden="true">${needs ? "△" : "✓"}</span>${title}</h2>
    ${
      keys.length
        ? keys
            .map((key) => {
              const concept = engine.concepts[key];
              return `<div class="result-item"><div class="result-item-line"><span>${esc(concept.title)}</span><span>${result.tags[key].correct} / ${result.tags[key].total}</span></div>
        <p>Correct in this quiz</p>${link(`/topic/${concept.topicId}?section=${concept.section}`, `${needs ? "Review this concept" : "Revisit the lesson"} ${arrow}`)}
      </div>`;
            })
            .join("")
        : `<p class="result-empty">${needs ? "All tested areas met the practice threshold. Keep connecting the ideas." : "No tested area reached the threshold yet. Use the lesson links to work through the concepts."}</p>`
    }
  </section>`;
}

export function resultsPage(data, attempt, engine) {
  const { quiz, unit, topic } = data;
  if (!attempt?.complete)
    return `<div class="results-wrap">${breadcrumbs(contextCrumbs(data, "Results"))}<div class="empty-state">
    <h1>${attempt ? "Finish your quiz first." : "Start with a quiz."}</h1>
    <p>${attempt ? "Continue where you left off." : "There are no completed results in this tab yet."}</p>
    ${attempt ? link(`/quiz/${quiz.id}`, `Continue quiz ${arrow}`, "btn") : quizButton(`Start quiz ${arrow}`, "start", quiz.id)}
  </div></div>`;
  const result = engine.summarize(attempt);
  const label = topic ? `Topic ${topic.code}` : `Unit ${unit.number}`;
  const reviewPath = topic
    ? `/topic/${topic.id}?section=connections`
    : unit.hasGuide
      ? `/guide/${unit.id}`
      : `/unit/${unit.id}`;
  return `<div class="results-wrap">${breadcrumbs(contextCrumbs(data, "Results"))}
    <header class="result-head"><p class="eyebrow">${attempt.mode === "weak" ? "Targeted practice" : esc(label)} · Results</p>
      <div class="result-score" aria-label="${result.correct} out of ${result.total} correct">${result.correct}<span> / ${result.total}</span></div>
      <p>${result.percent}% correct</p><h1>${result.correct === result.total ? "You connected the dots." : result.percent >= 50 ? "Your next step is clearer." : "You have a place to start."}</h1>
      <p>${result.correct === result.total ? "Every answer was correct. Try explaining the connections in your own words." : "Use these results to choose what to review, then give those ideas another try."}</p>
    </header>
    ${attempt.mode === "weak" ? '<p class="result-explainer">These results cover only targeted practice. Untested areas are not assessed here.</p>' : ""}
    <div class="results-grid">${resultGroup("Strong areas", result.strong, result, engine)}${resultGroup("Needs practice", result.weak, result, engine, true)}</div>
    <p class="result-explainer"><strong>Based on this quiz:</strong> “Strong” means at least 75% correct in a tested area. A few questions are a useful signal, not proof of mastery or an exam score prediction.</p>
    <div class="actions">${result.weak.length ? quizButton(`Practice weak areas ${arrow}`, "weak", quiz.id) : link(reviewPath, `Review connections ${arrow}`, "btn")}
      ${quizButton("Retry this quiz", "start", quiz.id, { secondary: true })}
      ${unit.writingQuizzes.map((item) => link(`/writing/${item.id}`, "Try the writing quiz", "text-link")).join("")}
    </div><p class="reuse-note">Retrying reuses this question pool in a different order. Unit practice draws from topic quizzes.</p>
    <section class="review-list"><h2>Review your answers</h2>${attempt.ids
      .map((id, index) => {
        const question = engine.questionById[id],
          hit = attempt.answers[id] === question.correctAnswer;
        return `<details class="review-question"><summary>${hit ? "✓" : "✗"} ${index + 1}. ${esc(question.prompt)}</summary>
        <p><strong>Your answer:</strong> ${esc(question.choices[attempt.answers[id]])}</p>
        ${hit ? "" : `<p><strong>Correct answer:</strong> ${esc(question.choices[question.correctAnswer])}</p>`}
        <p>${esc(question.explanation)}</p>${link(`/topic/${question.topicId}?section=${question.concept}`, "Review this lesson")}
      </details>`;
      })
      .join("")}</section>
  </div>`;
}
