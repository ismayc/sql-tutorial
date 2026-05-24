import type { QueryResult } from "./sql";

const MAX_DISPLAY_ROWS = 500;

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) {
    return `<span class="text-slate-400 italic">NULL</span>`;
  }
  if (typeof v === "number") return String(v);
  if (v instanceof Uint8Array) return `&lt;blob ${v.length} bytes&gt;`;
  return escapeHTML(String(v));
}

export function renderResultTable(target: HTMLElement, result: QueryResult): void {
  if (result.columns.length === 0) {
    target.innerHTML = `<div class="sql-result-empty">Statement executed (no rows returned).</div>`;
    return;
  }
  if (result.rows.length === 0) {
    target.innerHTML = `<div class="sql-result-wrap"><table class="sql-result-table"><thead><tr>${result.columns
      .map((c) => `<th>${escapeHTML(c)}</th>`)
      .join("")}</tr></thead></table><div class="sql-result-empty">No rows.</div></div>`;
    return;
  }

  const visibleRows = result.rows.slice(0, MAX_DISPLAY_ROWS);
  const truncated = result.rows.length > MAX_DISPLAY_ROWS;

  const head = `<thead><tr>${result.columns
    .map((c) => `<th>${escapeHTML(c)}</th>`)
    .join("")}</tr></thead>`;
  const body = `<tbody>${visibleRows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${formatCell(cell)}</td>`).join("")}</tr>`,
    )
    .join("")}</tbody>`;

  target.innerHTML = `<div class="sql-result-wrap"><table class="sql-result-table">${head}${body}</table>${
    truncated
      ? `<div class="sql-result-truncated">Showing first ${MAX_DISPLAY_ROWS.toLocaleString()} of ${result.rows.length.toLocaleString()} rows.</div>`
      : ""
  }</div>`;
}

export type StatusKind = "ok" | "warn" | "error" | "info";

export function renderStatus(target: HTMLElement, status: { kind: StatusKind; text: string }): void {
  target.setAttribute("data-kind", status.kind);
  target.textContent = status.text;
}
