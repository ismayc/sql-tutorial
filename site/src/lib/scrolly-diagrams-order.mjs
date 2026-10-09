// Scroll-driven diagrams for the full logical order of a query once a JOIN is
// involved, shown at the end of Joining Techniques. The single-table version
// (clauseOrderAct in scrolly-diagrams-sql.mjs) sits on Sorting and Grouping;
// these add JOIN ... ON and run on real rows from pnw_database.sqlite.
//
// Same act shape and reveal model as the other diagram files: every element a
// step toggles carries class "lyr" and a data-el id (see src/lib/scrolly.ts).

import { grid, esc, NULLDEFS, HERO_W } from "./scrolly-diagrams-sql.mjs";

// ===========================================================================
// 1. Written order vs. run order
// ===========================================================================
const WRITTEN = ["SELECT", "FROM", "JOIN … ON", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT"];
const RUN = ["FROM", "JOIN … ON", "WHERE", "GROUP BY", "HAVING", "SELECT", "ORDER BY", "LIMIT"];

const BOX_W = 200;
const BOX_H = 40;
const GAP = 10;
const LX = 120; // written column
const RX = 500; // run column
const TOP = 70;
const boxY = (i) => TOP + i * (BOX_H + GAP);

// Clause chips: blue for the clauses that build and filter rows, amber for
// SELECT (the one that moves), slate for the two that shape the output.
const fillFor = (c) => (c === "SELECT" ? "#EFD46A" : c === "ORDER BY" || c === "LIMIT" ? "#d9dee4" : "#cfe6f5");

function box(x, i, label, num) {
  const y = boxY(i);
  const n = num ? `<text x="${x + 16}" y="${y + BOX_H / 2 + 5}" class="d-hdr" text-anchor="middle">${num}</text>` : "";
  return (
    `<rect x="${x}" y="${y}" width="${BOX_W}" height="${BOX_H}" rx="6" style="fill:${fillFor(label)}" stroke="#111" stroke-width="2"/>` +
    `<text x="${x + BOX_W / 2}" y="${y + BOX_H / 2 + 6}" class="d-mono" text-anchor="middle">${esc(label)}</text>` +
    n
  );
}

function link(label, cls = "") {
  const a = WRITTEN.indexOf(label);
  const b = RUN.indexOf(label);
  const y1 = boxY(a) + BOX_H / 2;
  const y2 = boxY(b) + BOX_H / 2;
  const x1 = LX + BOX_W;
  const x2 = RX;
  const color = label === "SELECT" ? "#b8860b" : "#5a7184";
  const width = label === "SELECT" ? 4 : 2;
  return `<path d="M${x1},${y1} C${x1 + 90},${y1} ${x2 - 90},${y2} ${x2},${y2}" fill="none" stroke="${color}" stroke-width="${width}"${cls}/>`;
}

const orderMapSvg = [
  `<text x="${LX + BOX_W / 2}" y="${TOP - 22}" class="d-rttl" text-anchor="middle">as you write it</text>`,
  `<text x="${RX + BOX_W / 2}" y="${TOP - 22}" class="d-rttl" text-anchor="middle">as SQL runs it</text>`,
  // Written column is always visible: it is the query the reader already knows.
  ...WRITTEN.map((c, i) => box(LX, i, c)),
  `<g class="lyr" data-el="run">${RUN.map((c, i) => box(RX, i, c, i + 1)).join("")}</g>`,
  `<g class="lyr" data-el="links">${WRITTEN.filter((c) => c !== "SELECT").map((c) => link(c)).join("")}</g>`,
  `<g class="lyr" data-el="select-link">${link("SELECT")}</g>`,
  // Brackets naming the two halves of the run order.
  `<g class="lyr" data-el="halves">` +
    `<path d="M${RX + BOX_W + 14},${boxY(0)} h10 V${boxY(4) + BOX_H} h-10" fill="none" stroke="#1f6fa8" stroke-width="2.5"/>` +
    `<text x="${RX + BOX_W + 32}" y="${(boxY(0) + boxY(4) + BOX_H) / 2 - 4}" class="d-note">build and</text>` +
    `<text x="${RX + BOX_W + 32}" y="${(boxY(0) + boxY(4) + BOX_H) / 2 + 16}" class="d-note">filter rows</text>` +
    `<path d="M${RX + BOX_W + 14},${boxY(5)} h10 V${boxY(7) + BOX_H} h-10" fill="none" stroke="#6b7783" stroke-width="2.5"/>` +
    `<text x="${RX + BOX_W + 32}" y="${(boxY(5) + boxY(7) + BOX_H) / 2 - 4}" class="d-note">shape the</text>` +
    `<text x="${RX + BOX_W + 32}" y="${(boxY(5) + boxY(7) + BOX_H) / 2 + 16}" class="d-note">output</text>` +
    `</g>`,
].join("");

export const orderMapAct = {
  id: "scrolly-order-written-vs-run",
  thumb: "run,links,select-link",
  title: "Written order vs. the order SQL runs it",
  call: "SELECT …\n  FROM … JOIN … ON …\n WHERE …\n GROUP BY …\nHAVING …\n ORDER BY …\n LIMIT …;",
  viewBox: `0 0 ${HERO_W} ${boxY(7) + BOX_H + 20}`,
  svg: orderMapSvg,
  steps: [
    { beat: "Step 1 · the order you type", show: "", html: "Every query on this site is written in this order: <code>SELECT</code> first, then <code>FROM</code> and any <code>JOIN</code>, then the filters, and <code>LIMIT</code> last." },
    { beat: "Step 2 · the order SQL runs", show: "run", html: "SQL runs the same clauses in a different order. It needs rows before it can do anything else, so <code>FROM</code> and <code>JOIN … ON</code> come first." },
    { beat: "Step 3 · most clauses keep their place", show: "run,links", html: "<code>FROM</code>, <code>JOIN</code>, <code>WHERE</code>, <code>GROUP BY</code>, and <code>HAVING</code> each move up only one slot, and <code>ORDER BY</code> and <code>LIMIT</code> stay at the end." },
    { beat: "Step 4 · SELECT is the one that moves", show: "run,links,select-link", html: "<code>SELECT</code> is typed first but runs sixth. By the time it runs, the join is done, rows are filtered, and groups are formed. That is why a column alias such as <code>AS pop</code> works in <code>ORDER BY</code> but not in <code>WHERE</code>." },
    { beat: "Step 5 · two halves", show: "run,links,select-link,halves", html: "Read the run order in two halves. Steps 1 to 5 <b>build and filter rows</b>. Steps 6 to 8 <b>shape the output</b>: pick the columns, sort them, and keep the first few with <code>LIMIT</code>. The next diagram runs one real query through all eight." },
  ],
};

// ===========================================================================
// 2. One join query, clause by clause, on real rows
// ===========================================================================
// SELECT c.county, COUNT(*) AS n_towns, SUM(t.population_2020_census) AS pop
//   FROM pnw_towns AS t
//   JOIN pnw_counties AS c ON c.county_id = t.primary_county_id
//  WHERE c.state = 'Oregon' AND c.county IN ('Crook', 'Harney', 'Jefferson')
//  GROUP BY c.county
// HAVING COUNT(*) >= 2
//  ORDER BY pop DESC
//  LIMIT 1;
// Checked against site/public/data/pnw_database.sqlite on October 8, 2026:
// the join has 453 rows; grouped: Crook 1 / 10736, Harney 2 / 4375,
// Jefferson 3 / 10036; final row Jefferson | 3 | 10036. Bend (Deschutes) and
// Port Townsend (Jefferson County, Washington) stand in for the other 445 rows.
const ROWS = [
  // town, primary_county_id, county, state, pop
  ["Prineville", 7, "Crook", "Oregon", 10736],
  ["Burns", 13, "Harney", "Oregon", 2730],
  ["Hines", 13, "Harney", "Oregon", 1645],
  ["Culver", 16, "Jefferson", "Oregon", 1602],
  ["Madras", 16, "Jefferson", "Oregon", 7456],
  ["Metolius", 16, "Jefferson", "Oregon", 978],
  ["Port Townsend", 52, "Jefferson", "Washington", 10148],
  ["Bend", 9, "Deschutes", "Oregon", 99178],
];
const KEEP = [0, 1, 2, 3, 4, 5]; // rows WHERE keeps
const CC = { Crook: "#EFD46A", Harney: "#6FB5DF", Jefferson: "#C0562F" };
const fmt = (n) => n.toLocaleString("en-US");

const QX = 70;
const QY = 44;

// Titles here are whole clauses, longer than the table is wide, so draw them
// left-aligned above the table instead of grid()'s centered title.
function stage(el, title, cols, rows, note) {
  const g = grid(QX, QY, null, cols, rows);
  const t = `<text x="${QX}" y="${QY - 14}" class="d-rttl">${esc(title)}</text>`;
  const n = note ? `<text x="${QX}" y="${QY + g.height + 26}" class="d-note">${esc(note)}</text>` : "";
  return `<g class="lyr" data-el="${el}">${t}${g.svg}${n}</g>`;
}

const townCols = [
  { w: 170, label: "t.town" },
  { w: 190, label: "t.primary_county_id" },
  { w: 120, label: "t.pop" },
];
const joinCols = [
  { w: 160, label: "t.town" },
  { w: 130, label: "c.county" },
  { w: 130, label: "c.state" },
  { w: 110, label: "t.pop" },
];

const fromRows = ROWS.map(([town, id, , , pop]) => ({ cells: [{ t: town }, { t: id }, { t: fmt(pop) }] }));
const joinRows = (keepOnly, colored) =>
  ROWS.map(([town, , county, state, pop], i) => {
    const kept = KEEP.includes(i);
    const color = colored && kept ? CC[county] : "#fff";
    return {
      faded: keepOnly && !kept,
      cells: [{ t: town }, { t: county, fill: color, white: colored && kept && county === "Jefferson" }, { t: state }, { t: fmt(pop) }],
    };
  });

const groupCols = [
  { w: 140, label: "c.county" },
  { w: 120, label: "COUNT(*)" },
  { w: 230, label: "SUM(t.pop…)" },
];
const outCols = [
  { w: 140, label: "county" },
  { w: 120, label: "n_towns" },
  { w: 130, label: "pop" },
];
const g = (county, n, pop, extra = {}) => ({
  ...extra,
  cells: [{ t: county, fill: CC[county], white: county === "Jefferson" }, { t: n }, { t: fmt(pop) }],
});

const walkSvg = [
  NULLDEFS,
  stage("q-from", "FROM pnw_towns AS t", townCols, fromRows, "8 of 453 towns shown"),
  stage("q-join", "JOIN pnw_counties AS c ON c.county_id = t.primary_county_id", joinCols, joinRows(false, false), "each town gains its county's columns"),
  stage("q-where", "WHERE c.state = 'Oregon' AND c.county IN (…)", joinCols, joinRows(true, false), "6 rows left"),
  stage("q-group", "GROUP BY c.county", joinCols, joinRows(true, true), "3 groups"),
  stage("q-having", "HAVING COUNT(*) >= 2", groupCols, [g("Crook", 1, 10736, { faded: true }), g("Harney", 2, 4375), g("Jefferson", 3, 10036)]),
  stage("q-select", "SELECT c.county, COUNT(*) AS n_towns, SUM(…) AS pop", outCols, [g("Harney", 2, 4375), g("Jefferson", 3, 10036)]),
  stage("q-order", "ORDER BY pop DESC", outCols, [g("Jefferson", 3, 10036), g("Harney", 2, 4375)]),
  stage("q-limit", "LIMIT 1", outCols, [g("Jefferson", 3, 10036), g("Harney", 2, 4375, { faded: true })], "the result: one row"),
].join("");

export const joinOrderAct = {
  id: "scrolly-order-join-query",
  thumb: "q-group",
  title: "One join query, run clause by clause",
  call:
    "SELECT c.county, COUNT(*) AS n_towns,\n       SUM(t.population_2020_census) AS pop\n  FROM pnw_towns AS t\n  JOIN pnw_counties AS c\n    ON c.county_id = t.primary_county_id\n WHERE c.state = 'Oregon'\n   AND c.county IN ('Crook', 'Harney', 'Jefferson')\n GROUP BY c.county\nHAVING COUNT(*) >= 2\n ORDER BY pop DESC\n LIMIT 1;",
  viewBox: `0 0 ${HERO_W} 460`,
  svg: walkSvg,
  steps: [
    { beat: "Step 1 · FROM", show: "q-from", html: "SQL starts with <code>FROM pnw_towns AS t</code>: all 453 towns. Eight are shown here; the other rows go through the same steps. <code>t.pop</code> is short for <code>t.population_2020_census</code>." },
    { beat: "Step 2 · JOIN … ON", show: "q-join", html: "<code>JOIN … ON</code> runs next. Each town's <code>primary_county_id</code> is matched to a <code>county_id</code>, and the town's row gains that county's columns: Prineville gets Crook, Bend gets Deschutes. The join is finished before any filter runs." },
    { beat: "Step 3 · WHERE", show: "q-where", html: "<code>WHERE</code> filters the joined rows, so it can test county columns. Bend is out (Deschutes). So is <b>Port Townsend</b>: Washington has a Jefferson County too, and <code>c.state = 'Oregon'</code> is the only thing that excludes it. Six rows are left." },
    { beat: "Step 4 · GROUP BY", show: "q-group", html: "<code>GROUP BY c.county</code> sorts the six rows into three groups: Crook (1 town), Harney (2), and Jefferson (3)." },
    { beat: "Step 5 · HAVING", show: "q-having", html: "Each group is now one row, with its <code>COUNT(*)</code> and <code>SUM</code>. <code>HAVING COUNT(*) &gt;= 2</code> filters groups, so <b>Crook</b>, with one town, drops out. <code>WHERE</code> could not do this: the counts did not exist yet when it ran." },
    { beat: "Step 6 · SELECT", show: "q-select", html: "Only now does <code>SELECT</code> run. It names the output columns and creates the aliases <code>n_towns</code> and <code>pop</code>. Nothing earlier could use those names, because they did not exist yet." },
    { beat: "Step 7 · ORDER BY", show: "q-order", html: "<code>ORDER BY pop DESC</code> sorts the finished rows, and it can use the alias <code>pop</code> because <code>SELECT</code> has already run. Jefferson (10,036) moves ahead of Harney (4,375)." },
    { beat: "Step 8 · LIMIT", show: "q-limit", html: "<code>LIMIT 1</code> runs last and keeps only the first row of the sorted result: <b>Jefferson, 3 towns, 10,036 people</b>. Because it runs after <code>ORDER BY</code>, <code>LIMIT</code> keeps the top rows of the sort; without an <code>ORDER BY</code>, which rows you get is not guaranteed." },
  ],
};
