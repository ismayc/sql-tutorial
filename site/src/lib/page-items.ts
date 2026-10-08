// The examples and diagrams on one Examples page, in page order, for the
// sidebar's per-page list. Runs at build time: the page sources give the order
// (the TOC lists exercises only), and the diagram modules give each act's
// anchor id and title.
import * as joinActs from "./scrolly-diagrams.mjs";
import * as sqlActs from "./scrolly-diagrams-sql.mjs";
import * as moreActs from "./scrolly-diagrams-more.mjs";
import * as cardinalityActs from "./scrolly-diagrams-cardinality.mjs";

const pageSources = import.meta.glob("../pages/examples/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const acts = { ...joinActs, ...sqlActs, ...moreActs, ...cardinalityActs } as unknown as Record<
  string,
  { id?: string; title?: string }
>;

export type TocExercise = { id: string; title: string };
export type SubItem = { kind: "example" | "diagram"; id: string; label: string };

const ITEM = /<Scrolly act=\{(\w+)\}|<SqlExercise\s+id="([^"]+)"/g;
// "Selection 1: Create a quick reference..." -> "Selection 1". Editors without a
// numbered title (a follow-up editor such as example40b) are left out.
const NUMBERED = /^([A-Za-z][A-Za-z ]* \d+[a-z]?):/;

export function pageItems(slug: string, exercises: TocExercise[] = []): SubItem[] {
  const labels = new Map<string, string>();
  for (const e of exercises) {
    const m = NUMBERED.exec(e.title);
    if (m) labels.set(e.id, m[1]);
  }
  const src = pageSources[`../pages/examples/${slug}.mdx`] ?? "";
  const items: SubItem[] = [];
  for (const m of src.matchAll(ITEM)) {
    const act = m[1] ? acts[m[1]] : undefined;
    if (act?.id && act.title) items.push({ kind: "diagram", id: act.id, label: act.title });
    else if (m[2] && labels.has(m[2])) items.push({ kind: "example", id: m[2], label: labels.get(m[2])! });
  }
  return items;
}
