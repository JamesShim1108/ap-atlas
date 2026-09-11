import { createQuizEngine } from "./engine.js";
import { questionView, quizPage, resultsPage } from "./views.js";
import { quizButton } from "../ui.js";

export function createQuizController(data, store, { navigate }) {
  const engine = createQuizEngine(data.bank);
  const attempt = (id) => store.get(id, engine);

  function start(quizId, mode = "topic") {
    const prior = attempt(quizId);
    if (mode === "weak" && !prior?.complete) return;
    const ids = mode === "weak" ? engine.weakQuestionIds(prior) : null;
    const next = engine.createAttempt(quizId, ids, mode);
    if (next) store.save(next);
  }

  function quickView(quiz) {
    if (!attempt(quiz.id)) start(quiz.id, "quick");
    const current = attempt(quiz.id);
    if (!current.complete) return questionView(current, engine, data.bank.assets, true);
    const result = engine.summarize(current);
    return `<div class="quick-complete"><h3>Quick check complete: ${result.correct} / ${result.total}</h3>
      <p>${result.correct === result.total ? "Nice work. Try the topic quiz to connect these ideas." : "Revisit any concepts that felt uncertain, then try the topic quiz."}</p>
      <p class="muted">These answers are separate from your topic quiz score.</p>
      ${quizButton("Try these checks again", "restart-quick", quiz.id, { secondary: true })}
    </div>`;
  }

  function refresh(quizId, focusId) {
    const quiz = engine.quizById[quizId];
    const quick = quiz.quizType === "quick";
    const shell = document.getElementById(quick ? "quick-shell" : "quiz-shell");
    shell.innerHTML = quick
      ? quickView(quiz)
      : questionView(attempt(quizId), engine, data.bank.assets);
    const target = shell.querySelector(focusId);
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "nearest" });
    }
  }

  function change(event) {
    const form = event.target.closest(".question-card");
    if (!form || event.target.name !== "answer") return false;
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = false;
    return true;
  }

  function submit(event) {
    const form = event.target.closest(".question-card");
    if (!form) return false;
    event.preventDefault();
    const current = attempt(form.dataset.quiz);
    const selected = form.querySelector('input[name="answer"]:checked');
    if (!current || !selected || current.ids[current.index] !== form.dataset.question)
      return true;
    if (engine.checkAnswer(current, Number(selected.value))) {
      store.save(current);
      refresh(current.quizId, "#answer-feedback");
    }
    return true;
  }

  function click(control) {
    const { action, quiz: quizId, question: questionId } = control.dataset;
    const quiz = engine.quizById[quizId];
    if (!quiz) return false;
    if (action === "start" || action === "weak") {
      start(quizId, action === "weak" ? "weak" : "topic");
      navigate(`/quiz/${quizId}`);
    } else if (action === "restart-quick") {
      start(quizId, "quick");
      refresh(quizId, "#question-heading");
    } else if (action === "next") {
      const current = attempt(quizId);
      if (
        !current ||
        current.ids[current.index] !== questionId ||
        !engine.nextQuestion(current)
      )
        return true;
      store.save(current);
      if (quiz.quizType === "quick")
        refresh(quizId, current.complete ? ".quick-complete" : "#question-heading");
      else if (current.complete) navigate(`/results/${quizId}`);
      else refresh(quizId, "#question-heading");
    } else return false;
    return true;
  }

  return {
    attempt,
    start,
    quickView,
    change,
    submit,
    click,
    page: () => quizPage(data, attempt(data.quiz.id), engine, store.storageOK),
    results: () => resultsPage(data, attempt(data.quiz.id), engine),
  };
}
