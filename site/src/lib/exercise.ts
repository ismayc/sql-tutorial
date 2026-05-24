import { format as formatSql } from "sql-formatter";
import { createEditor } from "./editor";
import { runQuery } from "./sql";
import { diagnose, friendlyError } from "./diagnostics";
import { getProgress, setProgress, clearProgress } from "./progress";
import { renderResultTable, renderStatus } from "./ui";

function broadcastProgressChange() {
  window.dispatchEvent(new CustomEvent("sqlt:progress-changed"));
}

function tryFormat(sql: string): string | null {
  try {
    return formatSql(sql, { language: "sqlite", keywordCase: "upper", tabWidth: 2 });
  } catch {
    return null;
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function encodeSql(sql: string): string {
  // base64url
  const b = btoa(unescape(encodeURIComponent(sql)));
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeSql(s: string): string | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
    return decodeURIComponent(escape(atob(b64 + pad)));
  } catch {
    return null;
  }
}

function buildShareUrl(exerciseId: string | null, sql: string): string {
  const u = new URL(window.location.href);
  u.search = "";
  if (exerciseId) u.searchParams.set("q", exerciseId);
  u.searchParams.set("sql", encodeSql(sql));
  u.hash = exerciseId ?? "";
  return u.toString();
}

let scheduled = false;

export function initInteractive(): void {
  if (scheduled) return;
  scheduled = true;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan, { once: true });
  } else {
    scan();
  }
}

function scan() {
  document
    .querySelectorAll<HTMLElement>(".sql-exercise:not([data-hydrated])")
    .forEach(hydrateExercise);
  document
    .querySelectorAll<HTMLElement>(".sql-scratchpad:not([data-hydrated])")
    .forEach(hydrateScratchpad);
  highlightHashTarget();
}

function highlightHashTarget() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target || !target.classList.contains("sql-exercise")) return;
  // Defer to let layout settle, then scroll + flash
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.add("sqlt-flash");
    setTimeout(() => target.classList.remove("sqlt-flash"), 2200);
  });
}

function readTemplate(root: HTMLElement, selector: string): string {
  const el = root.querySelector<HTMLTemplateElement>(selector);
  if (!el) return "";
  return (el.content.textContent ?? "").trim();
}

function hydrateExercise(root: HTMLElement) {
  root.dataset.hydrated = "1";
  const id = root.dataset.id ?? "ex";
  const db = root.dataset.db ?? "pnw_database.sqlite";
  const requireOrdering = root.dataset.requireOrdering === "1";
  const initial = readTemplate(root, "template[data-initial]") || "-- Write your SQL here\n";
  const solution = readTemplate(root, "template[data-solution]");

  const saved = getProgress(id);
  const startVal = saved?.code ?? initial;

  const editorMount = root.querySelector<HTMLElement>(".editor-mount")!;
  const statusEl = root.querySelector<HTMLElement>(".sql-status")!;
  const resultEl = root.querySelector<HTMLElement>(".result-mount")!;
  const completedBadge = root.querySelector<HTMLElement>(".completed-badge")!;
  const hintItems = Array.from(root.querySelectorAll<HTMLElement>(".hint"));
  hintItems.forEach((el) => (el.hidden = true));
  let revealedHints = 0;

  const updateBadge = (done: boolean) => {
    completedBadge.hidden = !done;
  };
  updateBadge(saved?.completed === true);

  const runBtn = root.querySelector<HTMLButtonElement>("[data-action=run]")!;
  const checkBtn = root.querySelector<HTMLButtonElement>("[data-action=check]")!;
  const hintBtn = root.querySelector<HTMLButtonElement>("[data-action=hint]");
  const solBtn = root.querySelector<HTMLButtonElement>("[data-action=solution]");
  const resetBtn = root.querySelector<HTMLButtonElement>("[data-action=reset]")!;

  if (!solution) {
    checkBtn.hidden = true;
    solBtn && (solBtn.hidden = true);
  }
  if (hintItems.length === 0 && hintBtn) hintBtn.hidden = true;

  // Restore from share URL if ?q=<id>&sql=<base64url> targets this exercise
  const params = new URLSearchParams(window.location.search);
  const sharedFor = params.get("q");
  const sharedSql = params.get("sql");
  let effectiveStart = startVal;
  if (sharedFor === id && sharedSql) {
    const decoded = decodeSql(sharedSql);
    if (decoded) effectiveStart = decoded;
  }

  const editor = createEditor({
    parent: editorMount,
    initialValue: effectiveStart,
    dbFile: db,
    onChange: (val) => {
      setProgress(id, { code: val });
    },
    onSubmit: () => runBtn.click(),
  });

  const formatBtn = root.querySelector<HTMLButtonElement>("[data-action=format]");
  const shareBtn = root.querySelector<HTMLButtonElement>("[data-action=share]");

  formatBtn?.addEventListener("click", () => {
    const formatted = tryFormat(editor.getValue());
    if (formatted) {
      editor.setValue(formatted);
      renderStatus(statusEl, { kind: "info", text: "Formatted." });
    } else {
      renderStatus(statusEl, { kind: "warn", text: "Couldn't format — check your SQL syntax first." });
    }
  });

  shareBtn?.addEventListener("click", async () => {
    const url = buildShareUrl(id, editor.getValue());
    const ok = await copyToClipboard(url);
    renderStatus(statusEl, {
      kind: ok ? "ok" : "warn",
      text: ok ? "Share link copied to clipboard." : `Couldn't copy. Share link: ${url}`,
    });
  });

  runBtn.addEventListener("click", async () => {
    renderStatus(statusEl, { kind: "info", text: "Running…" });
    try {
      const result = await runQuery(db, editor.getValue());
      renderStatus(statusEl, {
        kind: "ok",
        text: `Returned ${result.rows.length} row(s).`,
      });
      renderResultTable(resultEl, result);
    } catch (e) {
      const text = await friendlyError(e as Error, db);
      renderStatus(statusEl, { kind: "error", text });
      resultEl.innerHTML = "";
    }
  });

  checkBtn.addEventListener("click", async () => {
    if (!solution) return;
    renderStatus(statusEl, { kind: "info", text: "Checking…" });
    let actual;
    try {
      actual = await runQuery(db, editor.getValue());
    } catch (e) {
      const text = await friendlyError(e as Error, db);
      renderStatus(statusEl, { kind: "error", text });
      resultEl.innerHTML = "";
      return;
    }
    let expected;
    try {
      expected = await runQuery(db, solution);
    } catch (e) {
      // Unexpected: the author's reference solution itself failed. Surface for the author.
      renderStatus(statusEl, {
        kind: "error",
        text: `Reference solution didn't run: ${(e as Error)?.message ?? String(e)}`,
      });
      return;
    }
    renderResultTable(resultEl, actual);
    const result = diagnose(expected, actual, { requireOrdering });
    if (result.ok) {
      renderStatus(statusEl, {
        kind: "ok",
        text: "✓ Your query matches the expected result.",
      });
      setProgress(id, { code: editor.getValue(), completed: true });
      updateBadge(true);
      broadcastProgressChange();
    } else {
      renderStatus(statusEl, {
        kind: "warn",
        text: result.primary ?? "Not quite — give it another try.",
      });
    }
  });

  hintBtn?.addEventListener("click", () => {
    if (revealedHints < hintItems.length) {
      const next = hintItems[revealedHints]!;
      next.hidden = false;
      revealedHints++;
      if (revealedHints === hintItems.length) {
        hintBtn.textContent = "All hints shown";
        hintBtn.disabled = true;
      }
    }
  });

  solBtn?.addEventListener("click", () => {
    if (!solution) return;
    editor.setValue(solution);
    renderStatus(statusEl, {
      kind: "info",
      text: "Solution loaded — click Run to execute it.",
    });
  });

  resetBtn.addEventListener("click", () => {
    editor.setValue(initial);
    renderStatus(statusEl, { kind: "info", text: "Reset to starter code." });
    clearProgress(id);
    updateBadge(false);
    broadcastProgressChange();
    resultEl.innerHTML = "";
    revealedHints = 0;
    hintItems.forEach((el) => (el.hidden = true));
    if (hintBtn) {
      hintBtn.disabled = false;
      hintBtn.textContent = "Hint";
    }
  });
}

function hydrateScratchpad(root: HTMLElement) {
  root.dataset.hydrated = "1";
  const db = root.dataset.db ?? "pnw_database.sqlite";
  const initial =
    readTemplate(root, "template[data-initial]") ||
    "-- Try a query\nSELECT name FROM sqlite_master WHERE type = 'table';\n";

  // Restore from share URL: ?db=<file>&sql=<base64url> (db param scopes to the matching scratchpad)
  const params = new URLSearchParams(window.location.search);
  const sharedDb = params.get("db");
  const sharedSql = params.get("sql");
  let effectiveStart = initial;
  if (sharedDb && sharedSql && (sharedDb === db || sharedDb === db.replace(/\..*$/, ""))) {
    const decoded = decodeSql(sharedSql);
    if (decoded) effectiveStart = decoded;
  }

  const editorMount = root.querySelector<HTMLElement>(".editor-mount")!;
  const statusEl = root.querySelector<HTMLElement>(".sql-status")!;
  const resultEl = root.querySelector<HTMLElement>(".result-mount")!;
  const runBtn = root.querySelector<HTMLButtonElement>("[data-action=run]")!;

  const editor = createEditor({
    parent: editorMount,
    initialValue: effectiveStart,
    dbFile: db,
    onSubmit: () => runBtn.click(),
  });

  const formatBtn = root.querySelector<HTMLButtonElement>("[data-action=format]");
  const shareBtn = root.querySelector<HTMLButtonElement>("[data-action=share]");
  formatBtn?.addEventListener("click", () => {
    const formatted = tryFormat(editor.getValue());
    if (formatted) {
      editor.setValue(formatted);
      renderStatus(statusEl, { kind: "info", text: "Formatted." });
    } else {
      renderStatus(statusEl, { kind: "warn", text: "Couldn't format — check your SQL syntax first." });
    }
  });
  shareBtn?.addEventListener("click", async () => {
    const u = new URL(window.location.href);
    u.search = "";
    u.searchParams.set("db", db.replace(/\..*$/, ""));
    u.searchParams.set("sql", encodeSql(editor.getValue()));
    const ok = await copyToClipboard(u.toString());
    renderStatus(statusEl, {
      kind: ok ? "ok" : "warn",
      text: ok ? "Share link copied to clipboard." : `Couldn't copy. Share link: ${u.toString()}`,
    });
  });

  runBtn.addEventListener("click", async () => {
    renderStatus(statusEl, { kind: "info", text: "Running…" });
    try {
      const result = await runQuery(db, editor.getValue());
      renderStatus(statusEl, {
        kind: "ok",
        text: `Returned ${result.rows.length} row(s).`,
      });
      renderResultTable(resultEl, result);
    } catch (e) {
      const text = await friendlyError(e as Error, db);
      renderStatus(statusEl, { kind: "error", text });
      resultEl.innerHTML = "";
    }
  });
}
