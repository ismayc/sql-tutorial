import { DataTable } from "simple-datatables";
import type { QueryResult } from "./sql";

const MAX_DISPLAY_ROWS = 2000;
const DATATABLE_THRESHOLD = 25; // rows; below this, render a plain table (no pagination/search)

let nextTableId = 0;
const activeTables = new WeakMap<HTMLTableElement, DataTable>();

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
  // Tear down any previous DataTable instance attached to a table inside target
  target.querySelectorAll<HTMLTableElement>("table").forEach((t) => {
    const dt = activeTables.get(t);
    if (dt) {
      try { dt.destroy(); } catch { /* ignore */ }
      activeTables.delete(t);
    }
  });

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
  const totalRows = result.rows.length;
  const usePagination = visibleRows.length > DATATABLE_THRESHOLD;

  const tableId = `sql-result-${++nextTableId}`;
  const head = `<thead><tr>${result.columns
    .map((c) => `<th>${escapeHTML(c)}</th>`)
    .join("")}</tr></thead>`;
  const body = `<tbody>${visibleRows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${formatCell(cell)}</td>`).join("")}</tr>`,
    )
    .join("")}</tbody>`;

  target.innerHTML = `<div class="sql-result-wrap${usePagination ? " sql-result-wrap--paginated" : ""}">
    <table id="${tableId}" class="sql-result-table">${head}${body}</table>
    ${truncated ? `<div class="sql-result-truncated">Showing first ${MAX_DISPLAY_ROWS.toLocaleString()} of ${totalRows.toLocaleString()} rows.</div>` : ""}
  </div>`;

  if (!usePagination) return;

  const tableEl = target.querySelector<HTMLTableElement>(`#${tableId}`);
  if (!tableEl) return;

  const dt = new DataTable(tableEl, {
    searchable: true,
    sortable: true,
    paging: true,
    perPage: 25,
    perPageSelect: [10, 25, 50, 100, 250],
    labels: {
      placeholder: "Filter rows…",
      perPage: "rows per page",
      noRows: "No matching rows",
      info: "Showing {start} to {end} of {rows} rows",
    },
  });
  activeTables.set(tableEl, dt);
}

export type StatusKind = "ok" | "warn" | "error" | "info";

export function renderStatus(target: HTMLElement, status: { kind: StatusKind; text: string }): void {
  target.setAttribute("data-kind", status.kind);
  target.textContent = status.text;
}
