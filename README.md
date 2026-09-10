Run the focused checks from the repository root:

```bash
node --test tests/unit-1.test.mjs
```

The checks cover all seven ready topics, lesson and concept relationships, unique question records, the 21-question unit pool, complete and weak-area quiz flows, writing draft transitions, tab-local persistence, study-guide rendering, and broken resource links. JavaScript syntax is also checked with `node --check` for the browser entry files. Browser visual and interaction testing must be performed separately in a browser.
