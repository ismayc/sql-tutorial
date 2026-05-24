import toc from "../generated-toc.json";

const PREFIX = "sqlt:";

interface SavedEntry { code: string; completed: boolean; updatedAt: number }
interface ExportShape { format: "sqlt-progress"; version: 1; exportedAt: string; entries: Record<string, SavedEntry> }

function readAll(): Record<string, SavedEntry> {
  const out: Record<string, SavedEntry> = {};
  if (typeof localStorage === "undefined") return out;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(PREFIX) || k === `${PREFIX}theme`) continue;
    try {
      const v = JSON.parse(localStorage.getItem(k)!) as SavedEntry;
      out[k.slice(PREFIX.length)] = v;
    } catch {
      /* skip malformed */
    }
  }
  return out;
}

function setStatus(el: HTMLElement, text: string, kind: "ok" | "warn" | "info" | "error" = "info") {
  const colors = {
    ok: "text-emerald-700 dark:text-emerald-400",
    warn: "text-amber-700 dark:text-amber-400",
    info: "text-slate-700 dark:text-slate-300",
    error: "text-rose-700 dark:text-rose-400",
  };
  el.className = `my-6 text-sm ${colors[kind]}`;
  el.textContent = text;
}

function buildSummary(entries: Record<string, SavedEntry>): string {
  const allSections = [...toc.examples, ...toc.exercises] as Array<{
    slug: string; title: string; exerciseIds: string[]; checkableIds: string[];
  }>;
  // Index each exercise to its (kind, sectionTitle)
  const known = new Map<string, { kind: string; sectionTitle: string }>();
  for (const s of toc.examples) for (const id of s.exerciseIds) known.set(id, { kind: "examples", sectionTitle: s.title });
  for (const s of toc.exercises) for (const id of s.exerciseIds) known.set(id, { kind: "exercises", sectionTitle: s.title });

  const totalSaved = Object.keys(entries).length;
  const totalCompleted = Object.values(entries).filter((e) => e.completed).length;
  const totalCheckable = [...toc.examples, ...toc.exercises].reduce((n, s) => n + s.checkableIds.length, 0);
  const orphaned = Object.keys(entries).filter((id) => !known.has(id));

  const html: string[] = [];
  html.push(`<div class="rounded-lg border border-slate-200 dark:border-slate-800 p-4 mb-4">
    <div class="text-sm">
      <strong>${totalCompleted}</strong> of <strong>${totalCheckable}</strong> exercises completed
      · <strong>${totalSaved}</strong> editor draft${totalSaved === 1 ? "" : "s"} saved
      ${orphaned.length ? `· <span class="text-amber-700 dark:text-amber-400">${orphaned.length} orphaned</span>` : ""}
    </div>
  </div>`);
  for (const kind of ["examples", "exercises"]) {
    const sections = (toc as Record<string, typeof toc.examples>)[kind];
    html.push(`<h3 class="font-semibold mt-6 mb-2 text-base">${kind === "examples" ? "Examples" : "Exercises"}</h3>`);
    html.push(`<table class="w-full text-sm border-collapse"><thead><tr class="text-left text-slate-500"><th class="py-1 pr-3">Section</th><th class="py-1 pr-3 text-right">Done</th><th class="py-1 pr-3 text-right">Total</th></tr></thead><tbody>`);
    for (const s of sections) {
      const done = s.checkableIds.filter((id) => entries[id]?.completed).length;
      html.push(`<tr class="border-t border-slate-200 dark:border-slate-800">
        <td class="py-1 pr-3">${s.title}</td>
        <td class="py-1 pr-3 text-right tabular-nums">${done}</td>
        <td class="py-1 pr-3 text-right tabular-nums text-slate-500">${s.checkableIds.length}</td>
      </tr>`);
    }
    html.push("</tbody></table>");
  }
  return html.join("");
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function initProgressPage(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}

function run() {
  const statusEl = document.getElementById("progress-status")!;
  const summaryEl = document.getElementById("progress-summary")!;
  const refresh = () => {
    summaryEl.innerHTML = buildSummary(readAll());
  };
  refresh();

  document.getElementById("export-btn")!.addEventListener("click", () => {
    const data: ExportShape = {
      format: "sqlt-progress",
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: readAll(),
    };
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    downloadJson(`sql-tutorial-progress-${stamp}.json`, data);
    setStatus(statusEl, "Downloaded.", "ok");
  });

  const importInput = document.getElementById("import-input") as HTMLInputElement;
  document.getElementById("import-btn")!.addEventListener("click", () => importInput.click());
  importInput.addEventListener("change", async () => {
    const f = importInput.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const data = JSON.parse(text);
      if (data?.format !== "sqlt-progress" || typeof data?.entries !== "object") {
        setStatus(statusEl, "That doesn't look like an SQL Tutorial progress export.", "error");
        return;
      }
      const existing = readAll();
      let added = 0, replaced = 0, skipped = 0;
      for (const [id, entry] of Object.entries(data.entries) as [string, SavedEntry][]) {
        if (!entry || typeof entry.code !== "string") { skipped++; continue; }
        const cur = existing[id];
        if (!cur) { added++; }
        else if ((entry.updatedAt ?? 0) > (cur.updatedAt ?? 0)) { replaced++; }
        else { skipped++; continue; }
        try {
          localStorage.setItem(PREFIX + id, JSON.stringify(entry));
        } catch {
          skipped++;
        }
      }
      window.dispatchEvent(new CustomEvent("sqlt:progress-changed"));
      setStatus(
        statusEl,
        `Imported. Added ${added}, updated ${replaced}, skipped ${skipped} (older/invalid).`,
        "ok",
      );
      refresh();
    } catch (e) {
      setStatus(statusEl, `Couldn't read that file: ${(e as Error).message}`, "error");
    } finally {
      importInput.value = "";
    }
  });

  document.getElementById("reset-btn")!.addEventListener("click", () => {
    if (!confirm("This erases every saved query and every completion flag in this browser. There's no undo. Continue?")) return;
    const all = readAll();
    for (const id of Object.keys(all)) localStorage.removeItem(PREFIX + id);
    window.dispatchEvent(new CustomEvent("sqlt:progress-changed"));
    setStatus(statusEl, "All progress cleared.", "warn");
    refresh();
  });
}
