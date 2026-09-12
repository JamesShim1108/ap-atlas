import { createContentStore } from "./content-store.js";
import { parseRoute, createRouteLoader } from "./router.js";
import { pageTitle, emptyPage, link } from "./ui.js";
import { homePage, courseListPage, coursePage, unitPage } from "./views/catalog.js";
import { startCarousel, toggleCarousel } from "./carousel.js";
import { createAttemptStore } from "./quiz/store.js";

// Persistent stores are separate from the page controllers, which change with the route.
const content = createContentStore();
const loadRoute = createRouteLoader(content);
const attemptStore = createAttemptStore();
const writingStores = new Map();
let termsStore = null;
const main = document.getElementById("main");
let currentPage = () => "",
  currentQuiz = null,
  currentWriting = null,
  currentTerms = null;
let stopCarousel = () => {},
  currentRoute = parseRoute(location.hash),
  routeGeneration = 0;
let pendingQuizStart = null;

function navigate(path) {
  if (location.hash === `#${path}`) repaint();
  else location.hash = `#${path}`;
}

function repaint() {
  stopCarousel();
  main.innerHTML = currentPage();
  stopCarousel = startCarousel();
}

async function selectPage(route, data, generation) {
  if (!data)
    return {
      html: () =>
        emptyPage(
          "Let’s get you back on track.",
          "We couldn’t find that page. Pick a course to continue.",
        ),
      title: "Page not found",
      description: "Choose a course to continue studying.",
    };
  const title =
    data.set?.title ||
    data.quiz?.title ||
    data.lesson?.title ||
    data.guide?.title ||
    data.unit?.title ||
    data.course?.title ||
    "Study smarter";
  const description =
    data.lesson?.summary ||
    data.unit?.description ||
    data.course?.description ||
    "Free lessons, key terms, and practice in one place.";
  const selected = { title, description };
  if (route.type === "home") selected.html = () => homePage(data, attemptStore.resume());
  else if (route.type === "courses") {
    selected.html = () => courseListPage(data);
    selected.title = "Courses";
  } else if (route.type === "course") selected.html = () => coursePage(data);
  else if (route.type === "unit") selected.html = () => unitPage(data, attemptStore.peek);
  else if (route.type === "terms") {
    const { termsIndexPage } = await import("./terms/views.js");
    selected.title = `Unit ${data.unit.number} terms`;
    selected.html = () => termsIndexPage(data);
  } else if (route.type === "term-set") {
    const { createTermsController } = await import("./terms/controller.js");
    const { createTermsStore } = await import("./terms/store.js");
    if (generation !== routeGeneration) return null;
    termsStore ||= createTermsStore();
    const unit =
      data.units.find((item) => item.id === route.params.get("unit")) || data.units[0];
    selected.terms = createTermsController({ ...data, unit }, termsStore, {
      repaint,
      mode: route.params.get("view") === "list" ? "list" : "cards",
    });
    selected.html = selected.terms.page;
  } else if (["topic", "quiz", "results"].includes(route.type)) {
    const { createQuizController } = await import("./quiz/controller.js");
    if (generation !== routeGeneration) return null;
    const controller = createQuizController(data, attemptStore, { navigate, repaint });
    selected.quiz = controller;
    if (pendingQuizStart === route.id) {
      controller.start(route.id);
      pendingQuizStart = null;
    }
    if (route.type === "topic") {
      const { lessonPage } = await import("./views/lesson.js");
      selected.html = () => lessonPage(data, controller);
    } else selected.html = route.type === "quiz" ? controller.page : controller.results;
  } else if (route.type === "guide") {
    const { studyGuidePage } = await import("./views/guide.js");
    selected.html = () => studyGuidePage(data);
  } else if (route.type === "writing") {
    const { createWritingStore } = await import("./writing/store.js");
    const { createWritingController } = await import("./writing/controller.js");
    const key = `${data.quiz.id}:${data.quiz.version}`;
    if (!writingStores.has(key)) writingStores.set(key, createWritingStore(data.quiz));
    selected.writing = createWritingController(data, writingStores.get(key), repaint);
    selected.html = selected.writing.page;
  }
  return selected.html
    ? selected
    : {
        html: () => emptyPage("Page not found", "Choose a course to continue."),
        title: "Page not found",
        description,
      };
}

async function render(focus = false) {
  const generation = ++routeGeneration;
  currentRoute = parseRoute(location.hash);
  const route = currentRoute;
  stopCarousel();
  currentQuiz = null;
  currentWriting = null;
  currentTerms = null;
  main.setAttribute("aria-busy", "true");
  main.innerHTML = '<div class="page-loading" role="status">Loading...</div>';
  try {
    const loaded = await loadRoute(route);
    if (loaded.stale) return;
    const page = await selectPage(route, loaded.data, generation);
    if (generation !== routeGeneration || !page) return;
    currentQuiz = page.quiz || null;
    currentWriting = page.writing || null;
    currentTerms = page.terms || null;
    currentPage = page.html;
    pageTitle(page.title, page.description);
    repaint();
    focusDestination(route, loaded.data, focus);
  } catch (error) {
    if (generation !== routeGeneration) return;
    console.error(error);
    pageTitle("Content could not load", "Retry loading this page or return to courses.");
    currentPage = () =>
      `<div class="empty-state"><h1>This page could not load.</h1><p>Check your connection, then try again.</p><button type="button" class="btn" data-action="retry-load">Try again</button> ${link("/courses", "Browse courses", "text-link")}</div>`;
    repaint();
  } finally {
    if (generation === routeGeneration) {
      main.removeAttribute("aria-busy");
      for (const [id, active] of [
        ["nav-home", route.type === "home"],
        ["nav-courses", route.type !== "home"],
      ]) {
        const element = document.getElementById(id);
        if (active) element.setAttribute("aria-current", "page");
        else element.removeAttribute("aria-current");
      }
    }
  }
}

function focusDestination(route, data, focus) {
  const section = route.params.get("section");
  const allowed =
    route.type === "home"
      ? ["courses"]
      : route.type === "topic"
        ? [
            "learn",
            "reading-guide",
            "terms",
            "connections",
            "practice",
            "writing",
            ...(data?.lesson.sections.map((item) => item.id) || []),
          ]
        : route.type === "unit"
          ? ["learn", "practice", "writing"]
          : [];
  if (section && allowed.includes(section)) {
    const element = document.getElementById(section);
    if (element) {
      element.setAttribute("tabindex", "-1");
      element.focus({ preventScroll: true });
      element.scrollIntoView({ block: "start" });
    }
  } else if (focus) {
    window.scrollTo({ top: 0, behavior: "instant" });
    main.focus({ preventScroll: true });
  }
}

// One delegated listener per event keeps handlers intact when pages are replaced.
document.addEventListener("input", (event) => currentWriting?.input(event));
document.addEventListener("change", (event) => {
  if (currentTerms?.change(event)) return;
  if (!currentWriting?.change(event)) currentQuiz?.change(event);
});
document.addEventListener("submit", (event) => {
  if (!currentWriting?.submit(event)) currentQuiz?.submit(event);
});
document.addEventListener("click", (event) => {
  if (currentTerms?.click(event)) return;
  if (currentWriting?.click(event)) return;
  if (event.target.closest(".skip-link")) {
    event.preventDefault();
    main.focus();
    return;
  }
  const control = event.target.closest("[data-action]");
  if (!control) return;
  if (control.dataset.action === "toggle-preview") {
    toggleCarousel(control);
    return;
  }
  if (control.dataset.action === "retry-load") {
    render(true);
    return;
  }
  if (currentQuiz?.click(control)) return;
  if (control.dataset.action === "start" && control.dataset.quiz) {
    pendingQuizStart = control.dataset.quiz;
    navigate(`/quiz/${control.dataset.quiz}`);
  }
});
document.addEventListener("keydown", (event) => currentTerms?.keydown(event));
window.addEventListener("hashchange", () => render(true));
render();
