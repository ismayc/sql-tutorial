// Scroll-driven diagrams for three more SQL topics: clause execution order,
// GROUP BY aggregation, and WHERE precedence (AND/OR/parentheses). Same "act"
// shape and reveal model as scrolly-diagrams.mjs (see src/lib/scrolly.ts).
//
// These use a generic grid renderer rather than the two-table join geometry.
// Each "stage" of a query is a small table stacked at the same spot; a step
// reveals just that stage (previous ones hide), so row filtering, bucketing,
// re-ordering, and trimming all fall out of swapping which layer is shown.

export const RH = 44;
export const HERO_W = 820;

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Group / category colors (shared vocabulary with the join diagrams).
export const GC = { OR: "#EFD46A", WA: "#6FB5DF", ID: "#C0562F" };
const OK = "#1f7a44";
const NO = "#c0261a";

export const NULLDEFS =
  `<defs><linearGradient id="nullfill2" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="#2f2f2f"/><stop offset="0.5" stop-color="#c9c9c9"/><stop offset="1" stop-color="#3a3a3a"/>` +
  `</linearGradient></defs>`;

// Render one table. cols: [{w,label,dim}]. rows: [{cells:[{t,fill,white,cls,dim,hl}], el, faded}].
// Wrapped so a caller can reveal the whole thing or per-row. `dim` fades a
// column header or a single cell (a column SELECT leaves out); `hl` rings a
// cell in the given color (the value an aggregate or subquery picked).
export function grid(x, y, title, cols, rows) {
  const tw = cols.reduce((a, c) => a + c.w, 0);
  const parts = [];
  if (title) parts.push(`<text x="${x + tw / 2}" y="${y - 12}" class="d-rttl" text-anchor="middle">${esc(title)}</text>`);
  let cx = x;
  cols.forEach((c) => {
    const dim = c.dim ? ' opacity="0.22"' : "";
    parts.push(`<text x="${cx + c.w / 2}" y="${y + 16}" class="d-hdr" text-anchor="middle"${dim}>${esc(c.label)}</text>`);
    cx += c.w;
  });
  const rings = [];
  rows.forEach((row, ri) => {
    const ry = y + 26 + ri * RH;
    let cx2 = x;
    const inner = row.cells
      .map((cell, ci) => {
        const w = cols[ci].w;
        let s;
        if (cell.t === null) {
          s =
            `<rect x="${cx2}" y="${ry}" width="${w}" height="${RH}" fill="url(#nullfill2)" stroke="#111" stroke-width="2.5"/>` +
            `<text x="${cx2 + w / 2}" y="${ry + RH / 2 + 5}" class="d-nan" text-anchor="middle">NULL</text>`;
        } else {
          const fill = cell.fill ?? "#fff";
          const white = cell.white ? ' fill="#fff"' : "";
          const cls = cell.cls ?? "d-cell";
          s =
            `<rect x="${cx2}" y="${ry}" width="${w}" height="${RH}" fill="${fill}" stroke="#111" stroke-width="2.5"/>` +
            `<text x="${cx2 + w / 2}" y="${ry + RH / 2 + 6}" class="${cls}" text-anchor="middle"${white}>${esc(cell.t)}</text>`;
        }
        if (cell.dim) s = `<g opacity="0.16">${s}</g>`;
        if (cell.hl) rings.push(`<rect x="${cx2}" y="${ry}" width="${w}" height="${RH}" fill="none" stroke="${cell.hl}" stroke-width="6"/>`);
        cx2 += w;
        return s;
      })
      .join("");
    // `gone` is a permanent fade. It must not reuse `drop on`: the driver strips
    // `on` from every .drop each step, which left these rows at full opacity.
    const cls = row.faded ? ' class="gone"' : row.droppable ? ' class="drop"' : "";
    const el = row.el ? ` data-el="${row.el}"` : "";
    parts.push(`<g${el}${cls}>${inner}</g>`);
  });
  parts.push(...rings); // drawn last so a neighbor row's border cannot cover them
  return { svg: parts.join(""), width: tw, height: 26 + rows.length * RH };
}

export const check = (v) => ({ t: v ? "✓" : "✗", cls: v ? "d-ok" : "d-no" });

// ===========================================================================
// 1. Clause execution order
// ===========================================================================
// Written order: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.
// Execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.
const TOWNS = [
  ["Portland", "OR", "650000"],
  ["Salem", "OR", "175000"],
  ["Seattle", "WA", "740000"],
  ["Spokane", "WA", "230000"],
  ["Tacoma", "WA", "220000"],
  ["Boise", "ID", "240000"],
  ["Nampa", "ID", "95000"],
  ["Astoria", "OR", "10000"],
];
const T_COLS = [
  { w: 150, label: "town" },
  { w: 90, label: "state" },
  { w: 130, label: "pop" },
];
const OX = 250; // shared left edge for the stacked stage tables
const OY = 70;

function clauseStage(el, title, cols, rows) {
  const g = grid(OX, OY, title, cols, rows);
  return `<g class="lyr" data-el="${el}">${g.svg}</g>`;
}

function townRows(keep = null, colorByState = false) {
  return TOWNS.map(([t, s, p], i) => ({
    faded: keep ? !keep.includes(i) : false,
    cells: [
      { t },
      { t: s, fill: colorByState ? GC[s] : "#fff", white: colorByState && s === "ID" },
      { t: p },
    ],
  }));
}

const clauseSvg = [
  NULLDEFS,
  // FROM: all 8 rows
  clauseStage("st-from", "FROM towns", T_COLS, townRows()),
  // WHERE: pop > 150000 drops Nampa (6) and Astoria (7)
  clauseStage("st-where", "after WHERE pop > 150000", T_COLS, townRows([0, 1, 2, 3, 4, 5])),
  // GROUP BY: surviving 6 rows colored into 3 state buckets
  clauseStage("st-group", "after GROUP BY state", T_COLS, townRows([0, 1, 2, 3, 4, 5], true)),
  // HAVING: three group rows with counts; ID (count 1) dropped
  clauseStage("st-having", "after HAVING COUNT(*) >= 2", [
    { w: 120, label: "state" },
    { w: 120, label: "COUNT(*)" },
  ], [
    { cells: [{ t: "OR", fill: GC.OR }, { t: "2" }] },
    { cells: [{ t: "WA", fill: GC.WA }, { t: "3" }] },
    { cells: [{ t: "ID", fill: GC.ID, white: true }, { t: "1" }], faded: true },
  ]),
  // SELECT: project to state, n (alias)
  clauseStage("st-select", "after SELECT state, COUNT(*) AS n", [
    { w: 120, label: "state" },
    { w: 90, label: "n" },
  ], [
    { cells: [{ t: "OR", fill: GC.OR }, { t: "2" }] },
    { cells: [{ t: "WA", fill: GC.WA }, { t: "3" }] },
  ]),
  // ORDER BY n DESC: WA first
  clauseStage("st-order", "after ORDER BY n DESC", [
    { w: 120, label: "state" },
    { w: 90, label: "n" },
  ], [
    { cells: [{ t: "WA", fill: GC.WA }, { t: "3" }] },
    { cells: [{ t: "OR", fill: GC.OR }, { t: "2" }] },
  ]),
  // LIMIT 1: keep WA only
  clauseStage("st-limit", "after LIMIT 1", [
    { w: 120, label: "state" },
    { w: 90, label: "n" },
  ], [
    { cells: [{ t: "WA", fill: GC.WA }, { t: "3" }] },
    { cells: [{ t: "OR", fill: GC.OR }, { t: "2" }], faded: true },
  ]),
].join("");

export const clauseOrderAct = {
  id: "scrolly-clause-order",
  thumb: "st-group", // gallery still: the final LIMIT stage is a single row
  title: "The order SQL runs the clauses",
  call: "SELECT state, COUNT(*) AS n\n  FROM towns\n WHERE pop > 150000\n GROUP BY state\nHAVING COUNT(*) >= 2\n ORDER BY n DESC\n LIMIT 1;",
  viewBox: `0 0 ${HERO_W} 470`,
  svg: clauseSvg,
  steps: [
    { beat: "Step 1 · FROM runs first", show: "st-from", html: "SQL does not start at <code>SELECT</code>. It starts at <code>FROM</code>, loading every row of <code>towns</code>. All 8 rows are on the table." },
    { beat: "Step 2 · then WHERE", show: "st-where", html: "<code>WHERE</code> filters <em>rows</em> next. <code>pop &gt; 150000</code> removes <b>Nampa</b> and <b>Astoria</b>, leaving 6 rows. <code>WHERE</code> runs before any grouping, so it cannot see <code>COUNT(*)</code>." },
    { beat: "Step 3 · then GROUP BY", show: "st-group", html: "<code>GROUP BY state</code> sorts the survivors into one bucket per state: <b>OR</b>, <b>WA</b>, and <b>ID</b>. Each color is a group." },
    { beat: "Step 4 · then HAVING", show: "st-having", html: "<code>HAVING</code> filters <em>groups</em>, not rows. <code>COUNT(*) &gt;= 2</code> drops <b>ID</b> (only one town). This is the job <code>WHERE</code> could not do." },
    { beat: "Step 5 · only now SELECT", show: "st-select", html: "<code>SELECT</code> runs here, near the end, choosing <code>state</code> and <code>COUNT(*) AS n</code>. That is why an alias like <code>n</code> is invisible to <code>WHERE</code> and <code>GROUP BY</code>: they already ran." },
    { beat: "Step 6 · then ORDER BY", show: "st-order", html: "<code>ORDER BY n DESC</code> sorts the finished rows, so <b>WA</b> (3) moves ahead of <b>OR</b> (2). Sorting happens after <code>SELECT</code>, so ordering by the alias <code>n</code> is allowed." },
    { beat: "Step 7 · LIMIT last", show: "st-limit", html: "<code>LIMIT 1</code> is the final cut, keeping only the top row. Written first, <code>SELECT</code> is the fifth thing to run; the shape of your result is decided in this order, not the order you typed." },
  ],
};

// ===========================================================================
// 2. GROUP BY aggregation
// ===========================================================================
// Focus: rows -> buckets -> one aggregated row per bucket, and HAVING vs WHERE.
const SALES = [
  ["OR", "120"],
  ["WA", "300"],
  ["OR", "80"],
  ["ID", "40"],
  ["WA", "150"],
  ["OR", "60"],
];
const GX = 250;
const GY = 70;

function salesRows(colored, keep = null) {
  return SALES.map(([s, amt], i) => ({
    el: `sale-${i}`,
    faded: keep ? !keep.includes(i) : false,
    cells: [
      { t: s, fill: colored ? GC[s] : "#fff", white: colored && s === "ID" },
      { t: amt },
    ],
  }));
}

const S_COLS = [
  { w: 110, label: "state" },
  { w: 120, label: "amount" },
];
const AGG_COLS = [
  { w: 110, label: "state" },
  { w: 150, label: "SUM(amount)" },
];

const groupSvg = [
  // raw rows (revealed individually so we can color them in place)
  `<g class="lyr" data-el="raw">${grid(GX, GY, "sales", S_COLS, salesRows(false)).svg}</g>`,
  `<g class="lyr" data-el="rawcolor">${grid(GX, GY, "sales (colored by state)", S_COLS, salesRows(true)).svg}</g>`,
  // aggregated: one row per state
  `<g class="lyr" data-el="agg">${grid(GX, GY, "GROUP BY state", AGG_COLS, [
    { cells: [{ t: "OR", fill: GC.OR }, { t: "260" }] },
    { cells: [{ t: "WA", fill: GC.WA }, { t: "450" }] },
    { cells: [{ t: "ID", fill: GC.ID, white: true }, { t: "40" }] },
  ]).svg}</g>`,
  // HAVING SUM(amount) >= 100 drops ID
  `<g class="lyr" data-el="having">${grid(GX, GY, "HAVING SUM(amount) >= 100", AGG_COLS, [
    { cells: [{ t: "OR", fill: GC.OR }, { t: "260" }] },
    { cells: [{ t: "WA", fill: GC.WA }, { t: "450" }] },
    { cells: [{ t: "ID", fill: GC.ID, white: true }, { t: "40" }], faded: true },
  ]).svg}</g>`,
].join("");

export const groupByAct = {
  id: "scrolly-group-by",
  thumb: "rawcolor",
  title: "GROUP BY: many rows collapse to one per group",
  call: "SELECT state, SUM(amount)\n  FROM sales\n GROUP BY state\nHAVING SUM(amount) >= 100;",
  viewBox: `0 0 ${HERO_W} 400`,
  svg: groupSvg,
  steps: [
    { beat: "Step 1 · the rows", show: "raw", html: "Six sales rows, several per state. On their own, SQL has no idea which rows belong together." },
    { beat: "Step 2 · label the groups", show: "rawcolor", html: "<code>GROUP BY state</code> tags each row with its group. Three colors here: <b>OR</b>, <b>WA</b>, and <b>ID</b>." },
    { beat: "Step 3 · collapse each group", show: "agg", html: "Each group collapses to <b>one</b> row, and <code>SUM(amount)</code> adds up the rows inside it: OR 120+80+60 = 260, WA 300+150 = 450, ID 40. Six rows became three." },
    { beat: "Step 4 · HAVING filters groups", show: "having", html: "<code>HAVING</code> runs on the grouped rows, so it can test <code>SUM(amount)</code>. <code>>= 100</code> drops <b>ID</b>. A plain <code>WHERE</code> could not do this: it runs before the groups exist." },
  ],
};

// ===========================================================================
// 3. WHERE precedence (AND / OR / parentheses)
// ===========================================================================
// pop>100k AND region='OR' OR coastal   vs   pop>100k AND (region='OR' OR coastal)
const WROWS = [
  // town, pop>100k, isOR, coastal
  ["Portland", true, true, false],
  ["Astoria", false, true, true],
  ["Seattle", true, false, false],
  ["Newport", false, true, true],
  ["Tacoma", true, false, true],
];
const evalA = (r) => (r[1] && r[2]) || r[3]; // AND binds tighter
const evalB = (r) => r[1] && (r[2] || r[3]); // parens force OR first

const WX = 150;
const WY = 74;
const W_COLS = [
  { w: 140, label: "town" },
  { w: 120, label: "pop>100k" },
  { w: 130, label: "region='OR'" },
  { w: 110, label: "coastal" },
];

// rows that A keeps but B drops (the ones parentheses change): Astoria, Newport
const isFlip = (r) => evalA(r) && !evalB(r);

// base condition table (revealed once). Flip rows are droppable so step 3 can
// fade them as they fall out under the parenthesized reading.
const condRows = WROWS.map((r, i) => ({
  el: `w-${i}`,
  droppable: isFlip(r),
  cells: [{ t: r[0] }, check(r[1]), check(r[2]), check(r[3])],
}));
const baseTable = grid(WX, WY, "conditions on each town", W_COLS, condRows);

// keep/drop columns for each parse, drawn to the right of the table
const KEEPX = WX + baseTable.width + 24;
function keepCol(el, label, fn) {
  const parts = [`<text x="${KEEPX + 55}" y="${WY + 16}" class="d-hdr" text-anchor="middle">${esc(label)}</text>`];
  WROWS.forEach((r, i) => {
    const ry = WY + 26 + i * RH;
    const pass = fn(r);
    parts.push(
      `<rect x="${KEEPX}" y="${ry}" width="110" height="${RH}" fill="${pass ? "#e7f6ec" : "#fbe7e5"}" stroke="#111" stroke-width="2.5"/>` +
        `<text x="${KEEPX + 55}" y="${ry + RH / 2 + 6}" class="${pass ? "d-ok" : "d-no"}" text-anchor="middle">${pass ? "keep" : "drop"}</text>`
    );
  });
  return `<g class="lyr" data-el="${el}">${parts.join("")}</g>`;
}

const flipEls = WROWS.map((r, i) => (isFlip(r) ? `w-${i}` : null)).filter(Boolean);

const whereSvg = [
  `<g data-el="wbase">${baseTable.svg}</g>`,
  keepCol("keepA", "A AND B OR C", evalA),
  keepCol("keepB", "A AND (B OR C)", evalB),
].join("");

export const wherePrecedenceAct = {
  id: "scrolly-where-precedence",
  title: "AND, OR, and what the parentheses change",
  call: "-- A: pop>100000 AND region='OR' OR coastal\n-- B: pop>100000 AND (region='OR' OR coastal)",
  viewBox: `0 0 ${HERO_W} 340`,
  svg: whereSvg,
  steps: [
    { beat: "Step 1 · the conditions", show: "wbase", html: "Three conditions per town: is it big (<code>pop&gt;100k</code>), is it in Oregon, and is it coastal. Every town is a different mix of <b>✓</b> and <b>✗</b>." },
    { beat: "Step 2 · AND binds tighter than OR", show: "wbase,keepA", html: "Without parentheses, SQL reads <code>A AND B OR C</code> as <code>(A AND B) OR C</code>: <code>AND</code> groups first. Any coastal town passes on <code>C</code> alone, so small coastal <b>Astoria</b> and <b>Newport</b> are kept." },
    { beat: "Step 3 · parentheses re-group it", show: "wbase,keepB," + flipEls.join(","), html: "Add parentheses: <code>A AND (B OR C)</code>. Now every kept row must be big. <b>Astoria</b> and <b>Newport</b> fail <code>pop&gt;100k</code>, so they flip to <b>drop</b>. Same three conditions, different answer." },
    { beat: "Step 4 · the lesson", show: "wbase,keepB", html: "Mixed <code>AND</code>/<code>OR</code> without parentheses almost never means what it looks like. When both appear in one <code>WHERE</code>, parenthesize the intent so the reader (and SQL) agree." },
  ],
};
