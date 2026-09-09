# Page One

Page One is a free AP study platform, starting with AP World History: Modern. That first course has complete learning and practice flows for Topics 1.1 (East Asia) and 1.2 (Dar al-Islam). The platform is not limited to World History.

The homepage has an introduction on the left and a rightward-moving course preview on the right, followed by a separate full-width Courses section and study steps. Each course uses one large, slightly rounded card with an explicit Open course button. The preview illustrates existing content, supports pausing, and becomes static for reduced-motion preferences. Course cards and availability counts are scoped to each course.

## Structure and hosting

GitHub Pages serves the `docs` folder from `main`. No installation or build step is required. JavaScript modules require an HTTP server rather than opening index.html directly from the filesystem.

- `docs/index.html`: shared header, footer, and metadata.
- `docs/content.js`: course records and assembled content exports.
- `docs/topic-1-2.js`: original Dar al-Islam lesson, vocabulary, connections, and questions.
- `docs/engine.js`: scoring, answer locking, attempt validation, shuffle, and concept-based retries.
- `docs/app.js`: reusable course, unit, lesson, quiz, and result views.
- `docs/styles.css`: responsive design using the existing cream and green palette.

## Content scope

Nine units and seven Unit 1 topics are listed. Topics 1.1 and 1.2 are available; the other topics, unit study guide, and unit practice remain clearly marked as forthcoming. Unit 1 as a whole is not complete.

Topic 1.1 has four lesson sections, eight terms, four connections, three quick checks, and eight quiz questions. Topic 1.2 has five sections, fourteen terms, five connections, three quick checks, and ten quiz questions. Its sections cover political change, religion and society, religious diffusion, intellectual innovation, and exchange. Lesson and quiz counts are derived from the records.

Each ready topic must have a lesson and both quick and topic quizzes. Every question needs a unique ID, a valid concept, four choices, a correct answer, and an explanation. Each concept's review link must point to a section in that topic's lesson.

## State and scoring

Quiz state remains in sessionStorage in the visitor's browser tab, with an in-memory fallback. The legacy storage key is intentionally retained so changing the visible branding does not erase active attempts. There are no accounts or cross-device records. Closing the tab ends the session.

Weak-area practice reuses questions associated with weaker concepts and replaces the current topic attempt. Restarting shuffles question order, not the question pool. A strong area requires at least 75% correct among tested questions in that concept. Untested areas are not assessed. This small-sample feedback is not an AP score prediction or proof of mastery.

## Provenance

Lessons and questions are original. Source PDFs are not included in the repository or published site.

- Topic 1.1 references the class Unit 1 reading, Tang/Song/Mongols slides, the public AP framework, and Columbia University's Asia for Educators resources listed in the lesson.
- Topic 1.2 references the uploaded AMSCO Unit 1 reading, printed pages 15–19 (PDF pages 12–16), and the 2026 AP framework, printed pages 40–41.
- Unit 2 and the Tang/Song/Mongols slides are outside the Dar al-Islam lesson's scope.

Chronology is distinguished from background: the great Seljuk empire predates the main period, successor states continued after 1200, Baghdad's fall in 1258 did not end scholarship everywhere, and the framework's A’ishah al-Ba’uniyyah example is explicitly labeled as later than 1450. Religious coexistence is distinguished from equal legal status. Broad or misleading generalizations from the reading are not reproduced.

Questions and fictional study scenarios are not official College Board questions or historical quotations. The College Board trademark disclaimer remains in the footer.

## Verification for this update

JavaScript syntax, module imports, local asset references, content relationships, and page-template generation passed. Engine checks exercised all 1,296 correct/incorrect patterns across the two topic quizzes and two quick checks, including locked answers, completion, valid saved states, and weak-area retries. Topic 1.2 question and vocabulary counts and review anchors were checked. Browser visual and interaction testing was not performed.

The homepage correction was checked with template and event-handler checks for section order, course entry buttons, the Courses anchor, pause/resume state, and Topic 1.2 navigation. Rightward animation and reduced-motion rules were checked in the stylesheet; this was not a browser-rendered visual test.
