// Optional audit against the supplied PDFs. No PDF or duplicated definitions
// are committed. Run: node scripts/verify-term-sources.mjs path-to-A.pdf path-to-B.pdf
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { termSet as a } from "../docs/content/world-history/terms/period-1-a.js";
import { termSet as b } from "../docs/content/world-history/terms/period-1-b.js";

const normalizeLayout = (text) =>
  text
    .replace(/\u200b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
assert.equal(process.argv.length, 4, "Supply the two class PDFs, A then B.");
for (const [index, set] of [a, b].entries()) {
  let source = normalizeLayout(
    execFileSync("pdftotext", ["-layout", process.argv[index + 2], "-"], {
      encoding: "utf8",
    }),
  );
  assert.ok(source.startsWith(set.title), "Source title does not match");
  source = source.slice(set.title.length).trimStart();
  for (const card of set.cards) {
    assert.ok(
      source.startsWith(card.term),
      `Missing, reordered, or extra term before ${card.term}`,
    );
    source = source.slice(card.term.length).replace(/^\s*[:-]?\s*/, "");
    assert.ok(source.startsWith(card.definition), `Definition differs: ${card.term}`);
    source = source.slice(card.definition.length).trimStart();
  }
  assert.equal(source, "", "Unimported source vocabulary remains");
  const digest = createHash("sha256")
    .update(JSON.stringify(set.cards.map(({ term, definition }) => [term, definition])))
    .digest("hex");
  console.log(`${set.title}: ${set.cards.length} exact matches; SHA256 ${digest}`);
}
