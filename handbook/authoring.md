# Editing Page One

Lessons contain content, views contain HTML, engines manage practice, and CSS controls appearance. A new topic uses the shared templates and does not need its own page or stylesheet.

## Find the right file

All paths start at the repository root. The current course folder is `docs/content/world-history/`.

| Change                                     | File or folder                                      |
| ------------------------------------------ | --------------------------------------------------- |
| Course title, summary, catalog order       | Course folder's `course.js`                         |
| Unit title, status, question selections    | `unit-01/unit.js` in the course folder              |
| Topic reading, terms, connections          | `unit-01/topics/east-asia/lesson.js`                |
| Topic questions and quiz selections        | Same topic folder, `questions.js`                   |
| Unit study guide                           | Unit folder's `study-guide.js`                      |
| Writing questions, criteria, model answers | Unit folder's `writing.js`                          |
| Shared citations                           | Course folder's `sources.js`                        |
| InSPECT or another course's framework      | Course folder's `framework.js`                      |
| Navigation and loading                     | `docs/app/main.js`, `router.js`, `content-store.js` |
| Catalog, lesson, and guide HTML            | `docs/app/views/`                                   |
| Quiz rules, saving, HTML, interactions     | `docs/app/quiz/`                                    |
| Writing rules, saving, HTML, interactions  | `docs/app/writing/`                                 |
| Paragraphs, tables, and figures            | `docs/app/blocks.js`                                |
| Animation timing and direction             | `docs/app/carousel.js`                              |
| Animation sizes, fading, transitions       | `docs/styles/carousel.css`                          |
| Shared colors and fonts                    | `docs/styles/tokens.css`                            |
| Reading background and spacing             | `docs/styles/lesson.css`                            |
| Other visual components                    | `docs/styles/`, one file per area                   |
| Site title, header, footer, description    | `docs/index.html`                                   |

## Everyday workflow

Use Node.js 22 or newer. Run `npm ci` after downloading the repository or updating `package-lock.json`.

1. Edit the authored files in `docs/content/`, `docs/app/`, or `docs/styles/`.
2. Run `npm run format` to apply the shared formatting rules.
3. Run `npm run build` after changing content or image records.
4. Run `npm run check` before committing.
5. Commit the authored changes and the updated `docs/generated/` files together.

The checks validate content, detect stale generated files, run Node tests, and check formatting. They do not launch a browser. For a local preview, serve the repository with VS Code Live Server and open `docs/index.html`. Modules and JSON requests need an HTTP server; directly opening an HTML file from disk is not supported.

GitHub Pages publishes `docs/` from `main`. The validation workflow checks pushes and pull requests. Requiring that check through GitHub branch protection can prevent invalid changes from merging; this project does not automatically change repository protection settings.

## Inside a content file

Use plain JavaScript objects with named exports. Comments are allowed; rendering functions do not belong in content. Follow this order:

1. Identity: schema version, permanent ID, ownership, order, title, period, status.
2. Overview: summary, reading time, learning goals, big idea, context.
3. Reading: sections with stable anchors, blocks, and a takeaway.
4. Review: reading guide, vocabulary, connections.
5. Sources: IDs referring to the course's source records.

`lesson.js` exports `lesson`. `questions.js` exports `bank`, with `questions` and `quizzes`. A unit's `writing.js` exports a `writingQuizzes` array. See existing topics for complete examples and `handbook/templates/` for annotated starting points.

Use two spaces, double quotes in JS, trailing commas in multiline objects, and one statement per line. Prettier handles indentation and wrapping. VS Code settings recommend its extension and enable formatting on save. Avoid manually aligning columns with spaces.

Comments should explain a decision or tell an editor what a field controls. Avoid comments that merely repeat the next line. Prefer named values such as `{ date, text }` over positional arrays that need explanation. Arrays still make sense for ordered lists and table rows.

Content fields are text, not HTML. A `<strong>` in a paragraph appears as text. Add a shared block type when new presentation is needed instead of embedding custom HTML in one lesson.

## Add a topic, unit, or course

For a topic, add a descriptively named folder under a unit's `topics/` directory. Copy `lesson.js` and `questions.js` from a nearby topic or the templates. Set the new IDs, ownership, and `order`, then write the content and questions. Add citations to the course's `sources.js` and reference their IDs. The build generates navigation and routes automatically.

A ready topic needs reading sections, learning goals, sources, one quick quiz, and one topic quiz. Quiz selections reference records in that topic's bank. Unit practice selects IDs from those banks, so a correction applies everywhere the question appears. A `soon` topic still has the complete lesson shape but does not need published quizzes and is not linked as available.

For a unit, add a folder containing `unit.js` with a unique positive `number`. Its `topics/`, `study-guide.js`, and `writing.js` are optional. Empty upcoming units can use `status: "soon"`. For a course, add a folder with `course.js`, a catalog `order`, and its units. `sources.js`, `framework.js`, and `assets.js` are optional until lessons reference them. Shared page templates need no course-specific edits.

The filename helps editors find content. The permanent ID supports links, saved work, and relationships. Keep IDs unchanged when renaming a title or folder. Course IDs use lowercase letters and digits, such as `world` or `biology`. Other route IDs begin with the course ID, such as `biology-1-cells`. Existing `world-1-1` links still work. Unit numbers and topic order determine display order.

Question IDs must be unique within their course. Section IDs must be unique within their topic. Quiz concepts use the topic and section together, so different topics can both contain `evidence`. Never reuse an old question ID for a different question. Increment a writing quiz's `version` when its prompt or structure changes enough to invalidate prior drafts.

## Images

Keep an image near the content that owns it:

| Used by                      | Image location            | Manifest                    |
| ---------------------------- | ------------------------- | --------------------------- |
| One topic                    | Topic folder's `assets/`  | Topic folder's `assets.js`  |
| Several topics in one course | Course folder's `assets/` | Course folder's `assets.js` |
| Several courses              | `docs/assets/shared/`     | `docs/content/assets.js`    |

Keep original large scans or editable artwork in the Git-ignored `image-originals/` folder or your own source storage. Commit optimized web copies and their manifest. Reference PDFs are not automatically published as website assets.

The image helper creates WebP copies up to 640, 1200, and 1600 pixels wide, without enlarging the source, and prints real dimensions:

```bash
npm run image -- image-originals/song-map.png docs/content/world-history/unit-01/topics/east-asia/assets song-map
```

Put the printed dimensions in `assets.js`. Paths are relative to that manifest, such as `./assets/song-map-1600.webp`. Each record needs a stable ID, title, creator, source URL, and license. Use images you made or have permission to publish. The build verifies files and dimensions, not copyright permission. Use a new filename when replacing an image to avoid stale browser copies.

Add a figure to a section's `blocks` array:

```js
{
  type: "image",
  assetId: "world-song-map",
  alt: "Describe the information this image conveys in the lesson.",
  caption: "Explain how the image supports the surrounding reading.",
}
```

Alt text describes useful visual information. The caption connects it to the lesson. Creator, source, and license stay in the manifest, so repeated uses share one credit record. The renderer provides responsive sizes, reserved dimensions, lazy loading, captions, credits, and a full-size link. Include a text equivalent for important information shown in a diagram.

Blocks also support `paragraph`, `callout`, `list`, and `table`. Question `stimulusBlocks` can use the same images and tables. Existing `stimulus` strings remain supported.

## Shared JS, CSS, and HTML

- Engines hold scoring and draft rules without DOM access.
- Stores handle browser persistence and validate saved work against loaded content.
- Views return HTML and escape text.
- Controllers respond to inputs and update the current view.
- The router and loader request the current page's required content.

Inside JS files, keep imports first, then constants, small helpers, and exports. Use named helpers for complicated rendering. Shared components let one fix improve all their uses.

`docs/styles.css` lists imports in their intended order. Each component's responsive rules stay in its file. Edit the relevant selector instead of appending overrides to the site stylesheet. Shared variables belong in `tokens.css`; figure layout belongs in `media.css`. Course content generally needs no course-specific CSS.

Use semantic HTML, input labels, buttons for actions, and links for navigation. Preserve keyboard focus when a view changes. The main page's loading state and retry button handle unavailable content. Carousel appearance lives in CSS; pause state, interval, and direction live in JS.

## Generated files and scale

`scripts/build-content.mjs` discovers folders, validates their relationships, and emits JSON into `docs/generated/`. Do not edit generated files; the next build replaces them.

The homepage downloads a compact catalog, not every lesson. A course has a unit index. Opening a topic loads that lesson and its quick/topic question bank. Unit practice loads the selected banks. Guides and writing exercises have separate payloads. Route and search indexes are generated per course. The search index is ready for future use; this change does not add a search UI.

Validation rejects duplicate IDs, invalid question selections, broken source references, missing images, incorrect dimensions, unknown blocks, and stale output. Content validates before new output is written. Adding thousands of topics grows the authored folders and offline build work, without making the homepage download all their readings.
