// Runtime loading uses generated JSON only. Authoring modules never enter the app bundle.
export function createContentStore({ fetchJson = readJson } = {}) {
  const requests = new Map();
  let revision = "";

  function load(path) {
    if (!requests.has(path)) {
      const request = fetchJson(path, revision).catch((error) => {
        requests.delete(path); // A temporary network failure must be retryable.
        throw error;
      });
      requests.set(path, request);
    }
    return requests.get(path);
  }

  async function catalog() {
    const data = await load("catalog.json");
    revision = data.revision;
    return data.courses;
  }

  async function page(type, id) {
    const courses = await catalog();
    if (type === "home" || type === "courses") return { courses };
    // Course IDs have no hyphens; content IDs begin with the owning course ID.
    const courseId = type === "course" ? id : id?.split("-")[0];
    const course = courses.find((item) => item.id === courseId);
    if (!course) return null;
    if (type === "course") return load(course.indexPath);
    const routes = await load(course.routesPath);
    const path = routes[type === "results" ? "quiz" : type]?.[id];
    if (!path) return null;
    const data = await load(path);
    if (type === "topic") return { ...data, bank: await load(data.bankPath) };
    if (type === "quiz" || type === "results") {
      const banks = [];
      // Only banks explicitly selected by this quiz are read.
      for (const bankPath of data.bankPaths || []) banks.push(await load(bankPath));
      if (!banks.length) banks.push(data);
      const quiz = data.quiz || data.quizzes.find((item) => item.id === id);
      if (!quiz || quiz.quizType === "quick") return null;
      return {
        ...data,
        quiz,
        bank: {
          questions: banks.flatMap((bank) => bank.questions),
          quizzes: [quiz],
          concepts: Object.fromEntries(
            banks.flatMap((bank) =>
              Object.values(bank.concepts).map((concept) => [
                `${concept.topicId}/${concept.id}`,
                concept,
              ]),
            ),
          ),
          assets: Object.assign({}, ...banks.map((bank) => bank.assets)),
        },
      };
    }
    return data;
  }

  return { catalog, page };
}

async function readJson(path, revision) {
  const url = new URL(`../generated/${path}`, import.meta.url);
  if (revision) url.searchParams.set("v", revision);
  const response = await fetch(url, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Could not load content (${response.status}).`);
  return response.json();
}
