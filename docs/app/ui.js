// All authored text passes through escapeHtml before entering a template.
export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

export const arrow = '<span aria-hidden="true">&#8594;</span>';

export function link(path, label, className = "") {
  return `<a href="#${escapeHtml(path)}" class="${escapeHtml(className)}">${label}</a>`;
}

export function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
    ${items
      .map(
        ([label, path], index) => `
      ${index ? '<span aria-hidden="true">/</span>' : ""}
      ${path ? link(path, escapeHtml(label)) : `<span aria-current="page">${escapeHtml(label)}</span>`}
    `,
      )
      .join("")}
  </nav>`;
}

export function contextCrumbs({ course, unit, topic }, tail) {
  return [
    ["Courses", "/courses"],
    [course.shortTitle, `/course/${course.id}`],
    ...(unit ? [[`Unit ${unit.number}`, `/unit/${unit.id}`]] : []),
    ...(topic ? [[`Topic ${topic.code}`, `/topic/${topic.id}`]] : []),
    ...(tail ? [[tail]] : []),
  ];
}

export function pageTitle(title, description) {
  document.title = `${title} | Page One`;
  document.querySelector('meta[name="description"]').content = description;
}

export function badge(status, label) {
  return `<span class="pill ${status === "soon" ? "soon" : ""}">${escapeHtml(label || (status === "soon" ? "Coming soon" : "Available now"))}</span>`;
}

export function quizButton(
  label,
  action,
  quizId,
  { secondary = false, questionId } = {},
) {
  return `<button type="button" class="btn ${secondary ? "secondary" : ""}"
    data-action="${escapeHtml(action)}" data-quiz="${escapeHtml(quizId)}"
    ${questionId ? `data-question="${escapeHtml(questionId)}"` : ""}>${label}</button>`;
}

export function quizEntry(quiz, attempt, label = "Take topic quiz") {
  if (attempt && !attempt.complete)
    return link(`/quiz/${quiz.id}`, `Resume quiz ${arrow}`, "btn");
  return quizButton(`${label} ${arrow}`, "start", quiz.id);
}

export function emptyPage(title, text, path = "/courses", label = "Browse courses") {
  return `<div class="empty-state"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p>${link(path, label, "btn")}</div>`;
}
