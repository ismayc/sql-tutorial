import { getProgress } from "./progress";

export function refreshSidebarProgress(): void {
  const sidebar = document.getElementById("sqlt-sidebar");
  if (!sidebar) return;

  const links = sidebar.querySelectorAll<HTMLAnchorElement>("[data-toc-link]");
  const groupCounts = new Map<string, { done: number; total: number }>();

  links.forEach((link) => {
    const csv = link.dataset.checkableIds ?? "";
    const ids = csv ? csv.split(",").filter(Boolean) : [];
    const done = ids.filter((id) => getProgress(id)?.completed === true).length;
    const total = ids.length;

    const progressEl = link.querySelector<HTMLElement>("[data-section-progress]");
    const completeEl = link.querySelector<HTMLElement>("[data-section-complete]");
    if (progressEl) progressEl.textContent = total ? `${done}/${total}` : "";
    if (completeEl) completeEl.hidden = !(total > 0 && done === total);

    // Roll up to the parent group
    const group = link.closest("details[data-group]")?.getAttribute("data-group");
    if (group) {
      const agg = groupCounts.get(group) ?? { done: 0, total: 0 };
      agg.done += done;
      agg.total += total;
      groupCounts.set(group, agg);
    }
  });

  groupCounts.forEach((agg, group) => {
    const el = sidebar.querySelector<HTMLElement>(`[data-group-progress="${group}"]`);
    if (el) el.textContent = `${agg.done}/${agg.total}`;
  });
}
