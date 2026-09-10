# Page One

Page One is a free study platform for courses. AP World History: Modern is the first course, and Unit 1, The Global Tapestry, is complete from Topics 1.1 through 1.7.

The learning loop is simple: understand a lesson, review the key terms and connections, practice questions, then choose what to revisit. Unit 1 also includes a study guide with a timeline, regional comparison table, InSPECT prompts, AMSCO companion reading prompts, and a short writing quiz.

## What is live

- Seven Unit 1 lessons covering East Asia, Dar al-Islam, South and Southeast Asia, the Americas, Africa, Europe, and comparison across the period.
- Topic vocabulary, connections, quick checks, and topic quizzes.
- A 21-question Unit 1 practice quiz with three selected questions from each topic.
- A Unit 1 writing quiz with one SAQ and three parts. Each response uses the Answer, Prove, Explain scaffold.
- InSPECT badges and prompts for environment, society, politics, economics, culture, and technology.
- Optional review links from quiz results back to the exact lesson concept.

The writing quiz saves drafts in the current browser tab. It does not automatically grade writing. After a response is reviewed, the student can compare it with one model response, assess each part as zero or one point, and revise.

## Structure and hosting

GitHub Pages serves the `docs` folder from `main`. No build step is required. JavaScript modules require an HTTP server, so opening `docs/index.html` directly from the filesystem will not load the site correctly.

- `docs/index.html`: shared document shell, metadata, and navigation.
- `docs/styles.css`: graph-paper theme, responsive layout, lesson surfaces, quiz states, and writing layout.
- `docs/content.js`: course records and the assembled Unit 1 content exports.
- `docs/topic-1-2.js`: the Dar al-Islam lesson, vocabulary, connections, and questions.
- `docs/unit-1-topics.js`: Topics 1.3 through 1.7, vocabulary, connections, and questions.
- `docs/unit-1-support.js`: InSPECT definitions, reading-guide prompts, resources, study-guide data, and the original SAQ.
- `docs/unit-1-views.js`: study-guide, reading-guide, InSPECT, and writing invitation views.
- `docs/writing.js` and `docs/writing-engine.js`: writing form behavior, tab-local persistence, review state, and self-assessment.
- `docs/engine.js`: multiple-choice attempts, scoring, answer locking, validation, and weak-area practice.
- `docs/app.js`: routing and reusable course, unit, lesson, quiz, result, guide, and writing views.

## Content and sources

The lessons, explanations, questions, model answers, and study prompts are original writing. The supplied AMSCO Unit 1 reading, the completed class AMSCO Topics 1.2 and 1.3 reading guide, the class InSPECT slides, and the uploaded course materials informed the content. Source PDFs and class files are not published in this repository.

The site also links students to public background and review resources:

- College Board’s AP World History: Modern Course and Exam Description and exam-update page.
- Heimler’s History Unit 1 review.
- Crash Course World History’s Mansa Musa and Islam in Africa lesson.
- Albert’s comparison review and Khan Academy’s South and Southeast Asia reading.
- UNESCO pages for Angkor, Cahokia, Great Zimbabwe, and Lalibela.
- Smithsonian National Museum of the American Indian pages on Inka roads, administration, construction, and mit’a.
- The Metropolitan Museum of Art pages on medieval European feudal relationships and monasticism.
- Smarthistory’s scholarly Angkor Wat overview and the Met’s Southeast Asia overview.

These links supplement the course. The College Board framework remains the authority for course scope. Questions are not official College Board questions, and APE is a classroom writing scaffold rather than an official scoring formula.

The content keeps chronology visible. Song China continued until 1279, the Delhi Sultanate began in 1206, Mali expanded in the thirteenth century, the Mexica Triple Alliance formed in 1428, and Inca expansion accelerated around 1438. Developments after 1450 are labeled as later context.

## State and scoring

Multiple-choice attempts and writing drafts remain in `sessionStorage` in the visitor’s browser tab, with an in-memory fallback. There are no accounts or cross-device records. Quiz results use a small-sample practice threshold: an area is labeled strong at 75 percent or higher among tested questions. This is feedback for study planning, not an AP score prediction.

## Verification

Run the focused Unit 1 checks from the repository root:

```bash
node --test tests/unit-1.test.mjs
```

The checks cover all seven ready topics, lesson and concept relationships, unique question records, the 21-question unit pool, complete and weak-area quiz flows, writing draft transitions, tab-local persistence, study-guide rendering, and broken resource links. JavaScript syntax is also checked with `node --check` for the browser entry files. Browser visual and interaction testing must be performed separately in a browser.
