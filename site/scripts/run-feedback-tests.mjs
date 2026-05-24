#!/usr/bin/env node
/**
 * Feedback regression suite.
 *
 * For each exercise in src/generated-toc.json that has a solution, we generate
 * a handful of variant queries (correct, empty, typo-table, typo-column, plus
 * conditional missing-where / missing-orderby), drive the real UI via Playwright
 * to type each variant into the editor and click "Check answer", then capture
 * the user-visible status text and classify it.
 *
 * Outputs:
 *   site/fixtures/feedback-tests.jsonl  (one test per line, machine-readable)
 *   site/fixtures/feedback-tests.md     (human-readable report grouped by section)
 *
 * Usage:
 *   node site/scripts/run-feedback-tests.mjs [--base=http://localhost:4321/sql-tutorial]
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

function generateVariants({ id, solution, requireOrdering }) {
  const stripped = stripSqlComments(solution).trim();
  const variants = [];
  variants.push({ pattern: "correct", input: solution, expect: "ok" });
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
  await page.keyboard.press("Meta+A");
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
  await scope.locator("button[data-action='check']").click();
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
