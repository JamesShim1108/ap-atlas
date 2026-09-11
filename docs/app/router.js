export function parseRoute(hash) {
  const [pathname, query = ""] = (hash.replace(/^#/, "") || "/").split("?");
  const parts = pathname.split("/").filter(Boolean);
  const type = parts[0] || "home";
  const validLength = ["home", "courses"].includes(type)
    ? parts.length <= 1
    : parts.length === 2;
  return {
    type: validLength ? type : "missing",
    id: parts[1],
    params: new URLSearchParams(query),
  };
}

// Route loads can finish out of order on slow connections. Only the newest may paint.
export function createRouteLoader(content) {
  let generation = 0;
  return async function load(route) {
    const request = ++generation;
    try {
      const data = await content.page(route.type, route.id);
      return { data, stale: request !== generation };
    } catch (error) {
      if (request !== generation) return { stale: true };
      throw error;
    }
  };
}
