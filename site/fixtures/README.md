# Feedback test fixtures

Machine- and human-readable record of the feedback message every exercise produces
for a handful of variant queries. Regenerated end-to-end by driving the real UI
in headless Chromium.

## Files

| File | What it is |
|---|---|
| `feedback-tests.jsonl` | One JSON object per test case. Pull from this in CI / scripts / dashboards. |
| `feedback-tests.md` | Same data grouped by section as a Markdown report you can scan by eye. |

## How it works

For each exercise in `site/src/generated-toc.json` that has a solution, the runner
generates 2–6 variant queries:

| Pattern | What it does | Expected outcome |
|---|---|---|
| `correct` | The canonical solution unchanged | `ok` (✓ pass) |
| `empty` | Empty editor contents | `fail` (warning) |
| `typo-table` | First table after FROM / JOIN gets an "x" appended | `error` (friendly SQL error) |
| `typo-column` | First column in the SELECT list gets an "x" appended | `error` |
| `missing-where` | Strips the WHERE clause (only generated if solution has WHERE) | `fail` |
| `missing-orderby` | Strips ORDER BY (only generated if `requireOrdering` is true) | `fail` |

Each variant is typed into the real CodeMirror editor, the "Check answer" button
is clicked, and the user-visible status text is captured.

### Outcome classes

| Class | Meaning |
|---|---|
| `ok` | Status starts with ✓ |
| `error` | Status contains "There's no column/table", "Did you mean", "syntax error", or starts with "SQL error" |
| `warn` | Status is a result-set diagnostic (e.g., "Too many rows: …") |
| `ref-broken` | Reference solution itself failed (would mean a bug in the source `.Rmd`) |
| `harness-error` | Something went wrong in Playwright; investigate the test runner |

A test `pass: true` means the actual outcome class matched the expected one — i.e.,
the student is getting the kind of feedback the test author intended.

### "Variant happens to produce the same result" caveat

A handful of variants (mostly `missing-where` on a scalar aggregate like
`MAX(arr_time) WHERE dest='ORD'`) genuinely produce the same answer as the reference
for this dataset — the global max already happens to be on an ORD flight. For those,
the runner tags the case with a `note` field and marks `pass: true`, because the ✓
the student would see is technically correct. They aren't feedback regressions; the
variant is just not a meaningful negative test against this particular data.

## Pulling data

```bash
# Every result-set diagnostic message we currently emit
jq -r 'select(.actualOutcome=="warn") | .actualMessage' fixtures/feedback-tests.jsonl | sort -u

# Every friendly SQL-error message we currently emit
jq -r 'select(.actualOutcome=="error") | .actualMessage' fixtures/feedback-tests.jsonl | sort -u

# Anything that didn't match expectation (after the data-coincidence note)
jq -c 'select(.pass==false)' fixtures/feedback-tests.jsonl

# All variants for a specific exercise
jq -c 'select(.exerciseId=="query23")' fixtures/feedback-tests.jsonl
```

## Re-running

The dev server must be reachable. Default base URL is
`http://localhost:4321/sql-tutorial`.

```bash
cd site
npm run dev          # in one terminal
node scripts/run-feedback-tests.mjs                       # in another
# or against a deploy:
node scripts/run-feedback-tests.mjs --base=https://ismayc.github.io/sql-tutorial
```

Takes ~35–45 s for the full 319-case suite. Outputs overwrite the files in this
directory, so commit them after each run.

## When to extend

- **New exercises added** to the `.Rmd` sources: re-run `python3 scripts/port_rmd.py`
  then this runner — new exercises pick up the default variant set automatically.
- **New diagnostic patterns** in `src/lib/diagnostics.ts`: bump the expected
  message-matching regex in `classify()` if needed.
- **New variant patterns** you want to test (e.g., wrong join condition, missing
  GROUP BY): add a generator branch in `generateVariants()`.
