# AP Atlas V0.1

Free AP study platform with a complete AP World Topic 1.1 sample flow.

## Structure

The site uses plain static HTML, CSS, and JavaScript modules, with no installation or build step. Serve the dist directory through an HTTP static server; opening index.html directly from the filesystem is not supported by browser module security.

- dist/content.js: course, unit, topic, lesson, term, connection, quiz, and question records.
- dist/engine.js: scoring, answer locking, attempt validation, shuffle, and concept-based retries.
- dist/app.js: reusable course, unit, topic, quiz, and result views with hash navigation.
- dist/styles.css: responsive academic theme.
- .openai/hosting.json: Sites identity and static output configuration.

Content is separate from presentation. Add records with stable IDs and relationships. Each ready topic needs a lesson plus topic and quick quizzes. Mark unfinished content as soon. Update homepage featured content when changing the initial course. Keep labels and learning-time estimates accurate.

## Current scope

Nine AP World units and seven Unit 1 topics are listed. Only Topic 1.1 has lesson content: four concept sections, eight terms, four connections, three quick checks, and eight quiz questions. Other content is clearly unavailable. Unit study guide and unit practice are reserved for later.

Quiz state lives only in sessionStorage in the visitor's browser tab, with in-memory fallback. There are no accounts, analytics, payments, uploads, or backend records. Closing the tab ends the study session. Do not describe this as cross-device saved progress or mastery tracking. Weak-area practice reuses questions and replaces the current quiz attempt. A repeated topic quiz changes question order, not the question pool.

Strong areas require at least 75% correct among answered questions in that concept; untested areas are not assessed. This is a small-sample practice signal, not an AP score prediction. All scoring is local and is not intended for secure assessment.

## Content provenance and review

Original explanations and questions were authored from class-reference themes and checked against the public 2026 AP World framework and Columbia University's Asia for Educators materials. The source PDFs are deliberately outside the repository and deployment; they are not redistributed.

References used: the uploaded Unit 1 AMSCO scan (Topic 1.1 pages successfully extracted through page 9), Tang/Song/Mongols lecture notes, and the public links listed in the lesson. Unit 2 is outside this release. Class slides label Song rule as ending around 1200; the lesson corrects the dynasty range to 960–1279. Other imprecise claims in the class references were not reproduced. Questions and study scenarios are original, not official College Board questions or historical quotations.

Student review is still needed before presenting this sample as a finished course. Retain the trademark disclaimer and avoid College Board branding.

## Verification performed

JavaScript syntax and local asset/import checks passed. Scoring was exercised for all 256 possible correct/incorrect patterns of the 8-question quiz, including duplicate submission rejection, state validation after every step, targeted concept selection, all-correct empty retry behavior, restart, and malformed saved-state rejection. Browser visual and interaction testing was not performed in this creation pass.

The site is initially published privately for its owner to review. Public audience changes are separate from publishing the source.
