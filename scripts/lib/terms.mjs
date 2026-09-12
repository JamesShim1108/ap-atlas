import { requireValue, requireText, uniqueById } from "./validate.mjs";

export function validateTermSet(set, courseId, location) {
  requireValue(set.schemaVersion === 1, location, "unsupported term schema");
  requireValue(set.courseId === courseId, location, "wrong term-set courseId");
  requireText(set.title, location);
  requireText(set.source, location);
  requireValue(
    Array.isArray(set.cards) && set.cards.length > 0,
    location,
    "term set needs cards",
  );
  uniqueById(set.cards, location);
  const terms = new Set();
  for (const card of set.cards) {
    requireText(card.term, location);
    requireText(card.definition, location);
    const normalized = card.term.normalize("NFC").trim().toLowerCase();
    requireValue(!terms.has(normalized), location, `duplicate term ${card.term}`);
    terms.add(normalized);
  }
}
