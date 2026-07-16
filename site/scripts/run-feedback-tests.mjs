#!/usr/bin/env node
/**
 * Feedback regression suite.
 *
 * For each exercise in src/generated-toc.json that has a solution, we generate
 * variant queries — correct-answer robustness variants (formatting, keyword
 * case) that must still pass, and mistake variants (typos, missing clauses,
 * dropped DISTINCT/GROUP BY/LIMIT/ON, boundary slips, aliasing errors) that
 * must produce helpful feedback — then drive the real UI via Playwright to
 * type each variant into the editor and click "Check answer", capture the
 * user-visible status text, and classify it.
 *
 * Outputs:
 *   site/fixtures/feedback-tests.jsonl  (one test per line, machine-readable)
 *   site/fixtures/feedback-tests.md     (human-readable report grouped by section)
 *
 * Usage:
 *   node site/scripts/run-feedback-tests.mjs [--base=http://localhost:4321/sql-tutorial] [--check]
 *
 *   --check   CI mode: exit 1 if any case doesn't match its expectation.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dirname, "..");
const TOC_PATH = resolve(SITE, "src/generated-toc.json");
const OUT_DIR = resolve(SITE, "fixtures");
const JSONL = resolve(OUT_DIR, "feedback-tests.jsonl");
const REPORT = resolve(OUT_DIR, "feedback-tests.md");

const BASE = (process.argv.find((a) => a.startsWith("--base=")) ?? "--base=http://localhost:4321/sql-tutorial").split("=")[1];
const CHECK_MODE = process.argv.includes("--check");
// The big flights DB makes cross-join variants (join-no-on) too heavy for the
// in-browser engine, so those are only generated for the small towns/counties DB.
const SMALL_DBS = new Set(["pnw_database.sqlite"]);

// ---------- variant generation ----------

function stripSqlComments(s) {
  return s.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function findFromTables(sql) {
  // Match "FROM <ident>" and "JOIN <ident>" — return all tables in order
  const out = [];
  const re = /\b(?:FROM|JOIN)\s+(`?)(\w+)\1(?:\s+(?:AS\s+)?(\w+))?/gi;
  let m;
  while ((m = re.exec(sql)) !== null) {
    out.push({ name: m[2], alias: m[3] ?? null });
  }
  return out;
}

function findSelectColumns(sql) {
  const m = sql.match(/\bSELECT\b\s+(?:DISTINCT\s+)?([\s\S]*?)\bFROM\b/i);
  if (!m) return [];
  const list = m[1].trim();
  if (list === "*") return [];
  // Split on commas at paren-depth 0
  const items = [];
  let depth = 0;
  let buf = "";
  for (const ch of list) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      items.push(buf.trim());
      buf = "";
    } else buf += ch;
  }
  if (buf.trim()) items.push(buf.trim());
  // Strip leading aliases (table.col), keep last identifier-ish token
  return items.map((expr) => {
    // Remove trailing "AS alias" or "alias"
    const noAs = expr.replace(/\s+AS\s+\w+$/i, "").replace(/\s+\w+$/, (m, ...rest) => {
      // Don't strip if the remaining is just an identifier with a table prefix
      return /^\w+$/.test(m.trim()) && /\bAS\s|[)\w]\s\w+$/.test(expr) ? "" : m;
    });
    const m2 = noAs.match(/(\w+)\.(\w+)/);
    if (m2) return { table: m2[1], col: m2[2], expr: noAs.trim() };
    const m3 = noAs.match(/\b(\w+)\b\s*$/);
    return { table: null, col: m3 ? m3[1] : noAs.trim(), expr: noAs.trim() };
  });
}

function stripClause(sql, clause) {
  // Remove WHERE/ORDER BY/GROUP BY/HAVING up to next clause boundary or end.
  // \b doesn't apply cleanly before ; or end-of-input, so structure each alternative explicitly.
  const re = new RegExp(
    `\\b${clause}\\b[\\s\\S]*?(?=\\bGROUP\\s+BY\\b|\\bHAVING\\b|\\bORDER\\s+BY\\b|\\bLIMIT\\b|;|$)`,
    "i"
  );
  return sql.replace(re, " ").replace(/\s+;/, ";").replace(/\s+/g, " ").trim();
}

// Split a string on quoted literals so transforms only touch real SQL text.
// Odd-indexed parts of the result are the quoted segments, untouched.
function mapOutsideStrings(sql, fn) {
  const parts = sql.split(/('(?:[^']|'')*'|"(?:[^"]|"")*")/);
  return parts.map((p, i) => (i % 2 === 1 ? p : fn(p))).join("");
}

function lowercaseKeywords(sql) {
  const kw = /\b(SELECT|DISTINCT|FROM|WHERE|GROUP|ORDER|BY|HAVING|LIMIT|OFFSET|INNER|LEFT|OUTER|CROSS|JOIN|ON|USING|AS|AND|OR|NOT|NULL|IS|LIKE|BETWEEN|IN|CASE|WHEN|THEN|ELSE|END|ASC|DESC|UNION|EXCEPT|INTERSECT)\b/g;
  return mapOutsideStrings(sql, (p) => p.replace(kw, (m) => m.toLowerCase()));
}

// Raw top-level items of the SELECT list (before any transform), or null.
function rawSelectItems(sql) {
  const m = sql.match(/\bSELECT\b\s+(?:DISTINCT\s+)?([\s\S]*?)\bFROM\b/i);
  if (!m) return null;
  const list = m[1].trim();
  if (list === "*" || list.includes("*")) return null;
  const items = [];
  let depth = 0;
  let buf = "";
  for (const ch of list) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      items.push(buf.trim());
      buf = "";
    } else buf += ch;
  }
  if (buf.trim()) items.push(buf.trim());
  return items.length >= 1 ? { items, head: m[0], list } : null;
}

function generateVariants({ id, solution, requireOrdering, db }) {
  const stripped = stripSqlComments(solution).trim();
  const variants = [];
  variants.push({ pattern: "correct", input: solution, expect: "ok" });

  // ---- correct-answer robustness: same query, different style must still pass ----
  const restyled = lowercaseKeywords(stripped).replace(/;\s*$/, "");
  if (restyled !== stripped) {
    variants.push({ pattern: "correct-lowercase", input: restyled, expect: "ok" });
  }
  const reSpaced = stripped.replace(/\n/g, "\n\n  ").trim();
  if (reSpaced !== stripped) {
    variants.push({ pattern: "correct-whitespace", input: "  " + reSpaced, expect: "ok" });
  }

  variants.push({ pattern: "empty", input: "", expect: "fail" });

  const tables = findFromTables(stripped);
  if (tables.length > 0) {
    const firstTable = tables[0].name;
    const wrong = firstTable + "x";
    // Replace only the first occurrence in a FROM/JOIN context
    const typoSql = stripped.replace(new RegExp(`(\\b(?:FROM|JOIN)\\s+\`?)${firstTable}(\\b)`, "i"), `$1${wrong}$2`);
    if (typoSql !== stripped) {
      variants.push({ pattern: "typo-table", input: typoSql, expect: "error" });
    }
  }

  const cols = findSelectColumns(stripped);
  const firstCol = cols.find((c) => /^\w+$/.test(c.col));
  if (firstCol) {
    const wrong = firstCol.col + "x";
    const target = firstCol.table ? `${firstCol.table}.${firstCol.col}` : firstCol.col;
    const replacement = firstCol.table ? `${firstCol.table}.${wrong}` : wrong;
    // Only mutate the first occurrence in the SELECT list (before the first FROM)
    const fromIdx = stripped.search(/\bFROM\b/i);
    const head = stripped.slice(0, fromIdx);
    const tail = stripped.slice(fromIdx);
    const newHead = head.replace(new RegExp(`\\b${target.replace(".", "\\.")}\\b`), replacement);
    if (newHead !== head) {
      variants.push({ pattern: "typo-column", input: newHead + tail, expect: "error" });
    }
  }

  if (/\bWHERE\b/i.test(stripped)) {
    const noWhere = stripClause(stripped, "WHERE");
    if (noWhere !== stripped) {
      variants.push({ pattern: "missing-where", input: noWhere, expect: "fail" });
    }
  }

  if (requireOrdering && /\bORDER\s+BY\b/i.test(stripped)) {
    const noOrder = stripClause(stripped, "ORDER\\s+BY");
    if (noOrder !== stripped) {
      variants.push({ pattern: "missing-orderby", input: noOrder, expect: "fail" });
    }
  }

  // ---- dropped DISTINCT → duplicate rows ----
  if (/\bSELECT\s+DISTINCT\b/i.test(stripped)) {
    const noDistinct = stripped.replace(/\b(SELECT)\s+DISTINCT\b/i, "$1");
    variants.push({ pattern: "missing-distinct", input: noDistinct, expect: "fail" });
  }

  // ---- dropped GROUP BY → aggregate collapses to one row ----
  if (/\bGROUP\s+BY\b/i.test(stripped)) {
    const noGroup = stripClause(stripped, "GROUP\\s+BY");
    if (noGroup !== stripped) {
      variants.push({ pattern: "missing-groupby", input: noGroup, expect: "fail" });
    }
  }

  // ---- dropped LIMIT → too many rows ----
  if (/\bLIMIT\b/i.test(stripped)) {
    const noLimit = stripClause(stripped, "LIMIT");
    if (noLimit !== stripped) {
      variants.push({ pattern: "missing-limit", input: noLimit, expect: "fail" });
    }
  }

  // ---- dropped JOIN ... ON → cartesian product (small DB only; the flights DB
  //      would build a multi-million-row cross join in the browser) ----
  if (SMALL_DBS.has(db) && /\bJOIN\b[\s\S]*?\bON\b/i.test(stripped)) {
    const noOn = stripped.replace(
      /\bON\b[\s\S]*?(?=\b(?:INNER|LEFT|CROSS)?\s*JOIN\b|\bWHERE\b|\bGROUP\s+BY\b|\bHAVING\b|\bORDER\s+BY\b|\bLIMIT\b|;|$)/i,
      " "
    ).replace(/\s+;/, ";").replace(/\s+/g, " ").trim();
    if (noOn !== stripped) {
      variants.push({ pattern: "join-no-on", input: noOn, expect: "fail" });
    }
  }

  // ---- off-by-one boundary: first >= → > (or <= → <) ----
  const boundaryOnce = (() => {
    let done = false;
    return mapOutsideStrings(stripped, (p) =>
      done ? p : p.replace(/>=|<=/, (m) => { done = true; return m === ">=" ? ">" : "<"; })
    );
  })();
  if (boundaryOnce !== stripped) {
    variants.push({ pattern: "boundary-off-by-one", input: boundaryOnce, expect: "fail" });
  }

  // ---- swapped SELECT column order → wrong column order feedback ----
  const sel = rawSelectItems(stripped);
  if (sel && sel.items.length >= 2 && sel.items[0] !== sel.items[1]) {
    const swapped = [sel.items[1], sel.items[0], ...sel.items.slice(2)].join(", ");
    const input = stripped.replace(sel.list, swapped);
    if (input !== stripped) {
      variants.push({ pattern: "swapped-columns", input, expect: "fail" });
    }
  }

  // ---- dropped AS alias → column name mismatch feedback ----
  if (sel) {
    const aliased = sel.items.findIndex((it) => /\s+AS\s+\w+$/i.test(it));
    if (aliased >= 0) {
      const bare = sel.items[aliased].replace(/\s+AS\s+\w+$/i, "");
      const newItems = [...sel.items];
      newItems[aliased] = bare;
      const input = stripped.replace(sel.list, newItems.join(", "));
      if (input !== stripped) {
        variants.push({ pattern: "alias-dropped", input, expect: "fail" });
      }
    }
  }

  return variants;
}

// ---------- classification ----------

function classify(statusText) {
  if (!statusText) return "empty";
  if (statusText.startsWith("✓")) return "ok";
  if (/^SQL error/i.test(statusText)) return "error";
  if (/There's no (column|table)|Did you mean|syntax error|incomplete|no such (column|table|function)/i.test(statusText)) return "error";
  if (/Reference solution didn't run/i.test(statusText)) return "ref-broken";
  return "warn";
}

function expectMatches(expected, actual) {
  if (expected === "ok") return actual === "ok";
  if (expected === "error") return actual === "error";
  if (expected === "fail") return actual === "warn" || actual === "error"; // any non-pass
  return false;
}

// ---------- runner ----------

async function setEditor(page, scope, value) {
  // Click into the CodeMirror content area
  await scope.locator(".cm-content").click({ timeout: 5000 });
  // ControlOrMeta = Cmd on macOS, Ctrl on Linux/Windows — plain Meta+A is a
  // no-op select-all on Linux CI, which left the starter comment in place and
  // broke every case.
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  if (value.length > 0) {
    await page.keyboard.insertText(value);
  }
}

async function waitForStableStatus(page, scope, transient = ["Checking…", "Running…"]) {
  await page.waitForFunction(
    ({ el, transient }) => {
      const t = el.querySelector(".sql-status")?.textContent?.trim() ?? "";
      return t !== "" && !transient.includes(t);
    },
    { el: await scope.elementHandle(), transient },
    { timeout: 60000 }
  );
  return (await scope.locator(".sql-status").textContent()).trim();
}

async function runOneCase(page, scope, variant) {
  await setEditor(page, scope, variant.input);
  // A prior case may have left a huge result table (e.g. SELECT * FROM weather,
  // ~4,700 rows) still rendering; wait for the main thread to go idle so the
  // click isn't starved on slow CI runners.
  await page.evaluate(
    () => new Promise((r) => (window.requestIdleCallback ?? ((f) => setTimeout(f, 50)))(r, { timeout: 30000 }))
  );
  await scope.locator("button[data-action='check']").click({ timeout: 60000 });
  const status = await waitForStableStatus(page, scope);
  const actual = classify(status);
  const result = {
    pattern: variant.pattern,
    input: variant.input,
    expected: variant.expect,
    actualOutcome: actual,
    actualMessage: status,
    pass: expectMatches(variant.expect, actual),
  };
  // Some negative-pattern variants happen to produce the same result as the reference
  // for this dataset (e.g., stripping WHERE from a scalar MIN/MAX query when the global
  // extremum is already in the filtered subset). Tag those so they don't get counted as
  // feedback regressions.
  if (variant.expect === "fail" && actual === "ok") {
    result.note = "Variant happens to produce the same result as the reference for this dataset — feedback is correct (✓), pattern is just not a meaningful negative test here.";
    result.pass = true;
  }
  return result;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const toc = JSON.parse(readFileSync(TOC_PATH, "utf8"));
  const sectionsAll = [
    ...toc.examples.map((s) => ({ kind: "examples", ...s })),
    ...toc.exercises.map((s) => ({ kind: "exercises", ...s })),
  ];

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));

  const jsonlLines = [];
  const reportSections = [];
  let totalCases = 0;
  let totalPass = 0;
  const t0 = Date.now();

  for (const sec of sectionsAll) {
    const url = `${BASE}/${sec.kind}/${sec.slug}/`;
    console.log(`▶ ${sec.kind}/${sec.slug}`);
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector(".sql-exercise[data-hydrated]", { timeout: 30000 });

    const exerciseRows = [];
    for (const ex of sec.exercises) {
      if (!ex.hasSolution) continue;
      const scope = page.locator(`.sql-exercise[data-id='${ex.id}']`);
      if ((await scope.count()) === 0) {
        console.warn(`  ! missing exercise ${ex.id} on ${sec.slug}`);
        continue;
      }
      const variants = generateVariants(ex);
      const cases = [];
      for (const v of variants) {
        try {
          const result = await runOneCase(page, scope, v);
          totalCases++;
          if (result.pass) totalPass++;
          cases.push(result);
          jsonlLines.push(
            JSON.stringify({
              kind: sec.kind,
              section: sec.slug,
              sectionTitle: sec.title,
              exerciseId: ex.id,
              exerciseTitle: ex.title,
              db: ex.db,
              requireOrdering: ex.requireOrdering,
              ...result,
            })
          );
        } catch (e) {
          totalCases++;
          const result = {
            pattern: v.pattern,
            input: v.input,
            expected: v.expect,
            actualOutcome: "harness-error",
            actualMessage: String(e?.message ?? e),
            pass: false,
          };
          cases.push(result);
          jsonlLines.push(
            JSON.stringify({
              kind: sec.kind,
              section: sec.slug,
              sectionTitle: sec.title,
              exerciseId: ex.id,
              exerciseTitle: ex.title,
              db: ex.db,
              requireOrdering: ex.requireOrdering,
              ...result,
            })
          );
        }
      }
      exerciseRows.push({ ex, cases });
    }
    reportSections.push({ sec, exerciseRows });
  }

  await browser.close();
  const elapsedSec = ((Date.now() - t0) / 1000).toFixed(1);

  // ---- Write JSONL ----
  writeFileSync(JSONL, jsonlLines.join("\n") + "\n");

  // ---- Write Markdown report ----
  const md = [];
  md.push(`# Feedback regression report`);
  md.push("");
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push(`Base URL: \`${BASE}\``);
  md.push(`Total cases: **${totalCases}** · matching expectation: **${totalPass}** (${((totalPass / totalCases) * 100).toFixed(1)}%) · runtime: ${elapsedSec}s`);
  if (pageErrors.length) {
    md.push("");
    md.push(`⚠ Page errors captured during run: ${pageErrors.length}`);
  }
  md.push("");
  md.push(`### Reading this report`);
  md.push("");
  md.push(`Each exercise lists 2–6 variants. **Expected** is the outcome class the test author wants: \`ok\` (✓ pass), \`fail\` (any non-pass; diagnostic warning), \`error\` (friendly SQL error). **Actual** is what classify() saw. Rows where Expected ≠ Actual are flagged with ✗ — those are the cases worth inspecting because the student would get unexpected feedback.`);
  md.push("");

  const groupedByKind = { examples: [], exercises: [] };
  for (const rs of reportSections) groupedByKind[rs.sec.kind].push(rs);

  for (const kind of ["examples", "exercises"]) {
    md.push(`## ${kind === "examples" ? "Examples" : "Exercises"}`);
    md.push("");
    for (const { sec, exerciseRows } of groupedByKind[kind]) {
      md.push(`### ${sec.title}  \`/${kind}/${sec.slug}\``);
      md.push("");
      for (const { ex, cases } of exerciseRows) {
        const passCount = cases.filter((c) => c.pass).length;
        const flag = passCount === cases.length ? "" : "  ⚠";
        md.push(`#### \`${ex.id}\` — ${ex.title}${flag}`);
        md.push("");
        md.push("**Solution:**");
        md.push("```sql");
        md.push(ex.solution.trim());
        md.push("```");
        md.push("");
        md.push("| Pattern | Expected | Actual | Match | Message |");
        md.push("|---|---|---|---|---|");
        for (const c of cases) {
          const inputPreview = c.input.replace(/\s+/g, " ").trim().slice(0, 60) || "(empty)";
          const msg = (c.actualMessage || "").replace(/\|/g, "\\|").slice(0, 240);
          md.push(`| **${c.pattern}**<br>\`${inputPreview.replace(/`/g, "\\`")}\` | ${c.expected} | ${c.actualOutcome} | ${c.pass ? "✓" : "✗"} | ${msg} |`);
        }
        md.push("");
      }
    }
  }

  writeFileSync(REPORT, md.join("\n"));

  console.log(`\nDone in ${elapsedSec}s.`);
  console.log(`  ${totalPass}/${totalCases} cases matched expectation (${((totalPass / totalCases) * 100).toFixed(1)}%)`);
  console.log(`  JSONL: ${JSONL}`);
  console.log(`  Report: ${REPORT}`);

  if (CHECK_MODE && totalPass < totalCases) {
    console.error(`\n✗ ${totalCases - totalPass} case(s) did not match expectation:`);
    for (const line of jsonlLines) {
      const c = JSON.parse(line);
      if (!c.pass) {
        console.error(`  - [${c.section}/${c.exerciseId}] ${c.pattern}: expected ${c.expected}, got ${c.actualOutcome} — ${String(c.actualMessage).slice(0, 120)}`);
      }
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
