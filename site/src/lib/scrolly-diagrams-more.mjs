// Scroll-driven diagrams, third set: one act per command that learners tend to
// misread. Same "act" shape and reveal model as scrolly-diagrams-sql.mjs (see
// src/lib/scrolly.ts), and the same grid renderer, plus two helpers used here:
// a status column drawn beside a fixed table (keep/drop, TRUE/FALSE/unknown,
// running counts) and a letter-box row for LIKE.
//
// Every behavior shown was checked against SQLite, the engine the site runs:
// COUNT variants over NULLs, `= NULL` keeping zero rows, `<>` dropping NULL
// rows, aggregates skipping NULL, inclusive BETWEEN, integer division, and
// LIKE being case-insensitive for ASCII (so no pattern here depends on case).
//
// Layer order matters for print: swap-style acts print only the LAST <g> layer,
// so each one lists its final stage last (and keeps static groups first).

import { grid, esc, GC, NULLDEFS, RH, HERO_W } from "./scrolly-diagrams-sql.mjs";

const RING = "#1b6ca8";
const RING_OK = "#1f7a44";
const RING_NO = "#c0261a";

const lyr = (el, inner) => `<g class="lyr" data-el="${el}">${inner}</g>`;
const tw = (cols) => cols.reduce((a, c) => a + c.w, 0);
const cx0 = (width) => Math.round((HERO_W - width) / 2);
const rowY = (y, i) => y + 26 + i * RH;
const title = (text, y = 40) =>
  `<text x="${HERO_W / 2}" y="${y}" class="d-rttl" text-anchor="middle">${esc(text)}</text>`;
const note = (x, y, text, anchor = "middle") =>
  `<text x="${x}" y="${y}" class="d-note" text-anchor="${anchor}">${esc(text)}</text>`;
const ring = (x, y, w, color = RING) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${RH}" fill="none" stroke="${color}" stroke-width="6"/>`;

const KIND = {
  ok: { fill: "#e7f6ec", cls: "d-ok" },
  no: { fill: "#fbe7e5", cls: "d-no" },
  unk: { fill: "#ececec", cls: "d-unk" },
  skip: { fill: "#f6f6f6", cls: "d-skip" },
  plain: { fill: "#fff", cls: "d-cell" },
};

// One status column aligned to a grid's rows. cells: [{t, kind, fill, white} | null].
// A null entry leaves that row empty (a row the walkthrough has not reached).
function sideCol(x, y, w, label, cells) {
  const parts = [`<text x="${x + w / 2}" y="${y + 16}" class="d-hdr" text-anchor="middle">${esc(label)}</text>`];
  cells.forEach((c, i) => {
    if (!c) return;
    const k = KIND[c.kind ?? "plain"];
    const ry = rowY(y, i);
    const white = c.white ? ' fill="#fff"' : "";
    parts.push(
      `<rect x="${x}" y="${ry}" width="${w}" height="${RH}" fill="${c.fill ?? k.fill}" stroke="#111" stroke-width="2.5"/>` +
        `<text x="${x + w / 2}" y="${ry + RH / 2 + 6}" class="${k.cls}" text-anchor="middle"${white}>${esc(c.t)}</text>`
    );
  });
  return parts.join("");
}

const keepDrop = (pass) => (pass ? { t: "keep", kind: "ok" } : { t: "drop", kind: "no" });

// A dark "answer" bar under a status column.
function totalBar(x, y, w, text) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="46" rx="6" fill="#10283d"/>` +
    `<text x="${x + w / 2}" y="${y + 30}" class="d-total" text-anchor="middle">${esc(text)}</text>`
  );
}

// ===========================================================================
// 1. SELECT picks columns (and AS renames them)
// ===========================================================================
const SEL_ROWS = [
  ["Portland", "OR", "Multnomah", "650000"],
  ["Salem", "OR", "Marion", "175000"],
  ["Seattle", "WA", "King", "740000"],
  ["Spokane", "WA", "Spokane", "230000"],
];
const SEL_COLS = [
  { w: 150, label: "town" },
  { w: 90, label: "state" },
  { w: 170, label: "county" },
  { w: 130, label: "pop" },
];
const SEL_Y = 70;

function selFull(el, ttl, dimIdx = []) {
  const cols = SEL_COLS.map((c, i) => ({ ...c, dim: dimIdx.includes(i) }));
  const rows = SEL_ROWS.map((r) => ({ cells: r.map((t, i) => ({ t, dim: dimIdx.includes(i) })) }));
  return lyr(el, grid(cx0(tw(cols)), SEL_Y, ttl, cols, rows).svg);
}
function selNarrow(el, ttl, labels) {
  const cols = [
    { w: 150, label: labels[0] },
    { w: 130, label: labels[1] },
  ];
  const rows = SEL_ROWS.map((r) => ({ cells: [{ t: r[0] }, { t: r[3] }] }));
  return lyr(el, grid(cx0(tw(cols)), SEL_Y, ttl, cols, rows).svg);
}

export const selectColumnsAct = {
  id: "scrolly-select-columns",
  thumb: "sel-dim", // gallery still: the fading columns say more than the final table
  title: "SELECT chooses columns, never rows",
  call: "SELECT town, pop\n  FROM towns;",
  viewBox: `0 0 ${HERO_W} 300`,
  svg: [
    selFull("sel-from", "FROM towns"),
    selFull("sel-dim", "SELECT town, pop", [1, 2]),
    selNarrow("sel-res", "result: 2 columns, still 4 rows", ["town", "pop"]),
    selFull("sel-star", "SELECT *"),
    selNarrow("sel-alias", "SELECT town AS town_name, pop AS population", ["town_name", "population"]),
  ].join(""),
  steps: [
    { beat: "Step 1 · FROM names the table", show: "sel-from", html: "<code>FROM towns</code> puts the whole table on the desk: every column and every row. Nothing has been chosen yet." },
    { beat: "Step 2 · SELECT lists columns", show: "sel-dim", html: "<code>SELECT town, pop</code> names the columns to keep. <code>state</code> and <code>county</code> fade out. Look at the rows: all four are untouched." },
    { beat: "Step 3 · the result", show: "sel-res", html: "The result is <b>narrower, not shorter</b>: 2 columns, still 4 rows, in the order you listed them. <code>SELECT</code> never removes rows. That is the job of <code>WHERE</code>." },
    { beat: "Step 4 · SELECT *", show: "sel-star", html: "<code>*</code> means <b>every column</b>, in table order. It is handy for a first look at a table. In a query you keep, name the columns so the result does not change when the table does." },
    { beat: "Step 5 · AS renames the output", show: "sel-alias", html: "<code>AS</code> gives a column a new name <b>in the result only</b>. The values are identical and the table itself still says <code>town</code> and <code>pop</code>." },
  ],
};

// ===========================================================================
// 2. DISTINCT
// ===========================================================================
const DIS = [
  ["Portland", "OR"],
  ["Seattle", "WA"],
  ["Salem", "OR"],
  ["Boise", "ID"],
  ["Tacoma", "WA"],
  ["Eugene", "OR"],
];
const DIS_REPEAT = DIS.map(([, s], i) => DIS.findIndex(([, s2]) => s2 === s) !== i);
const DIS_COLS = [
  { w: 150, label: "town", dim: true },
  { w: 110, label: "state" },
];
const DIS_Y = 70;
const stateCell = (s, colored) => ({ t: s, fill: colored ? GC[s] : "#fff", white: colored && s === "ID" });

function disStage(el, ttl, colored, fadeRepeats) {
  const rows = DIS.map(([t, s], i) => ({
    faded: fadeRepeats && DIS_REPEAT[i],
    cells: [{ t, dim: true }, stateCell(s, colored)],
  }));
  return lyr(el, grid(cx0(tw(DIS_COLS)), DIS_Y, ttl, DIS_COLS, rows).svg);
}

const DIS_PAIR_COLORS = { "OR|Lane": "#EFD46A", "OR|Linn": "#A5E07E", "WA|King": "#6FB5DF" };
const DIS_PAIRS = [
  ["OR", "Lane", false],
  ["WA", "King", false],
  ["OR", "Lane", true],
  ["OR", "Linn", false],
  ["WA", "King", true],
];
const DIS_PAIR_COLS = [
  { w: 110, label: "state" },
  { w: 130, label: "county" },
];

export const distinctAct = {
  id: "scrolly-distinct",
  thumb: "dis-mark",
  title: "DISTINCT: repeated values collapse to one",
  call: "SELECT DISTINCT state\n  FROM towns;",
  viewBox: `0 0 ${HERO_W} 390`,
  svg: [
    disStage("dis-all", "SELECT state", false, false),
    disStage("dis-color", "same values share a color", true, false),
    disStage("dis-mark", "repeats are removed", true, true),
    lyr(
      "dis-res",
      grid(cx0(110), DIS_Y, "SELECT DISTINCT state", [{ w: 110, label: "state" }], [
        { cells: [stateCell("OR", true)] },
        { cells: [stateCell("WA", true)] },
        { cells: [stateCell("ID", true)] },
      ]).svg
    ),
    lyr(
      "dis-pair",
      grid(
        cx0(tw(DIS_PAIR_COLS)),
        DIS_Y,
        "SELECT DISTINCT state, county",
        DIS_PAIR_COLS,
        DIS_PAIRS.map(([s, c, rep]) => {
          const fill = DIS_PAIR_COLORS[`${s}|${c}`];
          return { faded: rep, cells: [{ t: s, fill }, { t: c, fill }] };
        })
      ).svg
    ),
  ].join(""),
  steps: [
    { beat: "Step 1 · without DISTINCT", show: "dis-all", html: "<code>SELECT state</code> returns one value <b>per row</b>: six towns, six states, with <code>OR</code> three times and <code>WA</code> twice." },
    { beat: "Step 2 · spot the repeats", show: "dis-color", html: "Give each different value its own color. There are only <b>three</b> colors on the table: <b>OR</b>, <b>WA</b>, and <b>ID</b>." },
    { beat: "Step 3 · DISTINCT removes repeats", show: "dis-mark", html: "<code>DISTINCT</code> keeps one row for each different value and discards the rest. The faded rows are the repeats." },
    { beat: "Step 4 · the result", show: "dis-res", html: "Six rows in, <b>three rows out</b>: the list of states that appear at all. Use it to learn what categories a column holds before you filter or group on it." },
    { beat: "Step 5 · with two columns", show: "dis-pair", html: "<code>DISTINCT</code> applies to the <b>whole row</b>, not the first column. <code>OR, Lane</code> and <code>OR, Linn</code> both survive because the pair differs. Only exact duplicate pairs are removed." },
  ],
};

// ===========================================================================
// 3. COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column)
// ===========================================================================
const SEC = [
  ["Portland", "Washington"],
  ["Salem", "Polk"],
  ["Eugene", null],
  ["Bend", null],
  ["Tualatin", "Washington"],
  ["Astoria", null],
];
const SEC_COLS = [
  { w: 130, label: "town" },
  { w: 190, label: "secondary_county" },
];
const SEC_Y = 64;
const secRows = () => SEC.map(([t, c]) => ({ cells: [{ t }, { t: c }] }));

const CNT_W = 230;
const CNT_X0 = cx0(tw(SEC_COLS) + 24 + CNT_W);
const CNT_SX = CNT_X0 + tw(SEC_COLS) + 24;

function countLayer(el, label, counts) {
  // counts: per-row true (counted) or a string reason it was skipped
  let n = 0;
  const cells = counts.map((c) => (c === true ? { t: String(++n), kind: "ok" } : { t: c, kind: "skip" }));
  return lyr(el, sideCol(CNT_SX, SEC_Y, CNT_W, label, cells) + totalBar(CNT_SX, rowY(SEC_Y, SEC.length) + 12, CNT_W, `= ${n}`));
}

export const countAct = {
  id: "scrolly-count",
  title: "COUNT(*), COUNT(column), and COUNT(DISTINCT column)",
  call: "SELECT COUNT(*),\n       COUNT(secondary_county),\n       COUNT(DISTINCT secondary_county)\n  FROM towns;",
  viewBox: `0 0 ${HERO_W} 430`,
  svg: [
    NULLDEFS,
    `<g data-el="cnt-base">${grid(CNT_X0, SEC_Y, "", SEC_COLS, secRows()).svg}</g>`,
    countLayer("cnt-star", "COUNT(*)", SEC.map(() => true)),
    countLayer("cnt-col", "COUNT(secondary_county)", SEC.map(([, c]) => (c === null ? "NULL, skipped" : true))),
    countLayer(
      "cnt-distinct",
      "COUNT(DISTINCT secondary_county)",
      SEC.map(([, c], i) => (c === null ? "NULL, skipped" : SEC.findIndex(([, c2]) => c2 === c) !== i ? "repeat, skipped" : true))
    ),
  ].join(""),
  steps: [
    { beat: "Step 1 · a column with gaps", show: "", html: "Six towns. Only three spill into a second county, so <code>secondary_county</code> is <code>NULL</code> (the dark cells) for the other three. Three ways to count give three answers." },
    { beat: "Step 2 · COUNT(*) counts rows", show: "cnt-star", html: "<code>COUNT(*)</code> counts <b>rows</b> and does not look inside them. <code>NULL</code> or not, every row adds one: <b>6</b>." },
    { beat: "Step 3 · COUNT(column) skips NULL", show: "cnt-col", html: "<code>COUNT(secondary_county)</code> counts only the rows where that column <b>has a value</b>. The three <code>NULL</code> rows are skipped: <b>3</b>." },
    { beat: "Step 4 · COUNT(DISTINCT column)", show: "cnt-distinct", html: "<code>DISTINCT</code> also skips repeats. <b>Washington</b> appears twice but counts once, so there are <b>2</b> different secondary counties." },
    { beat: "Step 5 · three questions", show: "cnt-distinct", html: "How many rows? <code>COUNT(*)</code>. How many are filled in? <code>COUNT(column)</code>. How many different values? <code>COUNT(DISTINCT column)</code>. Pick the one that matches the question you were asked." },
  ],
};

// ===========================================================================
// 4. BETWEEN and IN
// ===========================================================================
const BI = [
  ["Tillamook", 5200],
  ["Astoria", 10000],
  ["Newport", 10300],
  ["Pullman", 32000],
  ["Olympia", 50000],
  ["Bend", 99000],
];
const BI_COLS = [
  { w: 150, label: "town" },
  { w: 120, label: "pop" },
];
const BI_Y = 64;
const BI_W = 130;
const BI_X0 = cx0(tw(BI_COLS) + 24 + BI_W);
const BI_SX = BI_X0 + tw(BI_COLS) + 24;
const IN_LIST = ["Astoria", "Bend", "Yakima"];

function biLayer(el, ttl, fn, ringCol, ringRows) {
  const rx = ringCol === 0 ? BI_X0 : BI_X0 + BI_COLS[0].w;
  return lyr(
    el,
    title(ttl) +
      sideCol(BI_SX, BI_Y, BI_W, "WHERE", BI.map((r) => keepDrop(fn(r)))) +
      ringRows.map((i) => ring(rx, rowY(BI_Y, i), BI_COLS[ringCol].w)).join("")
  );
}
const inRange = ([, p]) => p >= 10000 && p <= 50000;

export const betweenInAct = {
  id: "scrolly-between-in",
  title: "BETWEEN includes both ends, and IN checks a list",
  call: "-- a range\n WHERE pop BETWEEN 10000 AND 50000\n-- a list\n WHERE town IN ('Astoria', 'Bend', 'Yakima')",
  viewBox: `0 0 ${HERO_W} 380`,
  svg: [
    `<g data-el="bi-base">${grid(BI_X0, BI_Y, "", BI_COLS, BI.map(([t, p]) => ({ cells: [{ t }, { t: String(p) }] }))).svg}</g>`,
    biLayer("bi-between", "pop BETWEEN 10000 AND 50000", inRange, 1, [1, 4]),
    biLayer("bi-ge", "pop >= 10000 AND pop <= 50000", inRange, 1, [1, 4]),
    biLayer("bi-in", "town IN ('Astoria', 'Bend', 'Yakima')", ([t]) => IN_LIST.includes(t), 0, [1, 5]),
  ].join(""),
  steps: [
    { beat: "Step 1 · the rows", show: "", html: "Six towns sorted by population. Two of them sit <b>exactly</b> on a round number: Astoria at 10000 and Olympia at 50000." },
    { beat: "Step 2 · BETWEEN is inclusive", show: "bi-between", html: "<code>BETWEEN 10000 AND 50000</code> keeps both endpoints. <b>Astoria</b> (10000) and <b>Olympia</b> (50000), ringed in blue, are in the range." },
    { beat: "Step 3 · the same thing, spelled out", show: "bi-ge", html: "<code>BETWEEN</code> is shorthand for <code>&gt;= low AND &lt;= high</code>, and the keep/drop column is identical. If you need to exclude an endpoint, write the comparisons yourself with <code>&gt;</code> or <code>&lt;</code>." },
    { beat: "Step 4 · IN checks a list", show: "bi-in", html: "<code>IN (...)</code> keeps a row when its value equals <b>any</b> item in the list, replacing a chain of <code>OR</code>s. <code>'Yakima'</code> is in the list but not in the table, which is fine: it matches no row." },
  ],
};

// ===========================================================================
// 5. LIKE wildcards
// ===========================================================================
const LK = ["Wilsonville", "Coupeville", "Portland", "Ashland", "Salem", "Sandy", "Seattle"];
const LK_BW = 32;
const LK_MAX = Math.max(...LK.map((n) => n.length));
const LK_Y = 64;
const LK_KW = 110;
const LK_X0 = cx0(LK_MAX * LK_BW + 24 + LK_KW);
const LK_SX = LK_X0 + LK_MAX * LK_BW + 24;
const LK_FILL = { lit: "#EFD46A", pct: "#cfe6f5", one: "#e3cbe0" };

// Returns, per character of `s`, the index of the pattern token it matched, or
// null when the pattern does not match. `%` takes the shortest run that works.
// Case-insensitive, as SQLite's LIKE is for ASCII.
function likeMatch(pattern, s) {
  const P = [...pattern];
  const S = [...s];
  const go = (pi, si) => {
    if (pi === P.length) return si === S.length ? [] : null;
    if (P[pi] === "%") {
      for (let k = si; k <= S.length; k++) {
        const rest = go(pi + 1, k);
        if (rest) return [...Array(k - si).fill(pi), ...rest];
      }
      return null;
    }
    if (si < S.length && (P[pi] === "_" || P[pi].toLowerCase() === S[si].toLowerCase())) {
      const rest = go(pi + 1, si + 1);
      return rest ? [pi, ...rest] : null;
    }
    return null;
  };
  return go(0, 0);
}

function likeLayer(el, pattern) {
  const P = pattern ? [...pattern] : [];
  const parts = [title(pattern ? `town LIKE '${pattern}'` : "town")];
  LK.forEach((name, i) => {
    const y = rowY(LK_Y, i);
    const assign = pattern ? likeMatch(pattern, name) : null;
    const boxes = [...name]
      .map((ch, k) => {
        let fill = "#fff";
        if (assign) {
          const tok = P[assign[k]];
          fill = tok === "%" ? LK_FILL.pct : tok === "_" ? LK_FILL.one : LK_FILL.lit;
        }
        const x = LK_X0 + k * LK_BW;
        return (
          `<rect x="${x}" y="${y + 3}" width="${LK_BW}" height="${RH - 6}" fill="${fill}" stroke="#111" stroke-width="2"/>` +
          `<text x="${x + LK_BW / 2}" y="${y + RH / 2 + 6}" class="d-mono" text-anchor="middle">${esc(ch)}</text>`
        );
      })
      .join("");
    parts.push(`<g${pattern && !assign ? ' class="gone"' : ""}>${boxes}</g>`);
  });
  if (pattern) parts.push(sideCol(LK_SX, LK_Y, LK_KW, "WHERE", LK.map((n) => keepDrop(likeMatch(pattern, n)))));
  return lyr(el, parts.join(""));
}

const LK_LEGEND_Y = rowY(LK_Y, LK.length) + 18;
const likeLegend =
  `<g data-el="lk-legend">` +
  [
    [LK_FILL.lit, "typed letters, matched exactly"],
    [LK_FILL.pct, "covered by %"],
    [LK_FILL.one, "one _ each"],
  ]
    .map(([fill, label], i) => {
      const x = LK_X0 + [0, 250, 400][i]; // spaced by label length, not evenly
      return (
        `<rect x="${x}" y="${LK_LEGEND_Y}" width="22" height="22" fill="${fill}" stroke="#111" stroke-width="2"/>` +
        `<text x="${x + 30}" y="${LK_LEGEND_Y + 16}" class="d-hdr">${esc(label)}</text>`
      );
    })
    .join("") +
  `</g>`;

export const likeAct = {
  id: "scrolly-like",
  title: "LIKE: what % and _ stand for",
  call: "SELECT town\n  FROM towns\n WHERE town LIKE '%ville';",
  viewBox: `0 0 ${HERO_W} ${LK_LEGEND_Y + 44}`,
  svg: [likeLegend, likeLayer("lk-names", null), likeLayer("lk-ville", "%ville"), likeLayer("lk-land", "%land%"), likeLayer("lk-s5", "S____")].join(""),
  steps: [
    { beat: "Step 1 · text, letter by letter", show: "lk-names", html: "<code>LIKE</code> compares text to a <b>pattern</b>. Letters you type must match exactly. Two wildcard characters stand in for the parts you do not care about: <code>%</code> and <code>_</code>." },
    { beat: "Step 2 · ends with", show: "lk-ville", html: "In <code>'%ville'</code> the <code>%</code> covers <b>any run of characters</b> (blue), then <code>ville</code> must finish the name (yellow). <b>Wilsonville</b> and <b>Coupeville</b> pass. Nothing else ends that way." },
    { beat: "Step 3 · contains", show: "lk-land", html: "A <code>%</code> on both sides, <code>'%land%'</code>, finds <code>land</code> <b>anywhere</b>. In <b>Portland</b> and <b>Ashland</b> the trailing <code>%</code> covers nothing at all, and that is allowed: <code>%</code> means zero or more characters." },
    { beat: "Step 4 · exactly one character", show: "lk-s5", html: "Each <code>_</code> stands for <b>exactly one</b> character (purple). <code>'S____'</code> is an S plus four more: five letters in total. <b>Salem</b> and <b>Sandy</b> fit. <b>Seattle</b> starts with S but has seven letters, so it fails." },
    { beat: "Step 5 · choosing a wildcard", show: "lk-s5", html: "Use <code>%</code> when the length does not matter and <code>_</code> when it does. With no wildcard, <code>LIKE</code> is an equality test. In SQLite, <code>LIKE</code> ignores upper and lower case for plain letters; other databases may not, so check before you rely on it." },
  ],
};

// ===========================================================================
// 6. NULL: = NULL vs IS NULL
// ===========================================================================
const NU_RW = 150;
const NU_KW = 110;
const NU_X0 = cx0(tw(SEC_COLS) + 20 + NU_RW + NU_KW);
const NU_RX = NU_X0 + tw(SEC_COLS) + 20;
const NU_NOTE_Y = rowY(SEC_Y, SEC.length) + 34;
const TRI = {
  true: { t: "TRUE", kind: "ok" },
  false: { t: "FALSE", kind: "no" },
  unknown: { t: "unknown", kind: "unk" },
};

function nullLayer(el, ttl, fn) {
  const results = SEC.map(([, c]) => fn(c));
  const kept = results.filter((r) => r === "true").length;
  return lyr(
    el,
    title(ttl) +
      sideCol(NU_RX, SEC_Y, NU_RW, "test result", results.map((r) => TRI[r])) +
      sideCol(NU_RX + NU_RW, SEC_Y, NU_KW, "WHERE", results.map((r) => keepDrop(r === "true"))) +
      note(NU_RX + (NU_RW + NU_KW) / 2, NU_NOTE_Y, `${kept} ${kept === 1 ? "row" : "rows"} kept`)
  );
}

export const nullAct = {
  id: "scrolly-null",
  title: "NULL is not a value: = NULL versus IS NULL",
  call: "-- keeps nothing\n WHERE secondary_county = NULL\n-- the test that works\n WHERE secondary_county IS NULL",
  viewBox: `0 0 ${HERO_W} 400`,
  svg: [
    NULLDEFS,
    `<g data-el="nu-base">${grid(NU_X0, SEC_Y, "", SEC_COLS, secRows()).svg}</g>`,
    nullLayer("nu-eq", "secondary_county = NULL", () => "unknown"),
    nullLayer("nu-is", "secondary_county IS NULL", (c) => (c === null ? "true" : "false")),
    nullLayer("nu-isnot", "secondary_county IS NOT NULL", (c) => (c === null ? "false" : "true")),
    nullLayer("nu-neq", "secondary_county <> 'Polk'", (c) => (c === null ? "unknown" : c !== "Polk" ? "true" : "false")),
  ].join(""),
  steps: [
    { beat: "Step 1 · NULL means no value", show: "", html: "<code>NULL</code> (the dark cells) is not zero and not an empty string. It marks a value that was <b>never recorded</b>. Three of these six towns have no secondary county." },
    { beat: "Step 2 · = NULL keeps nothing", show: "nu-eq", html: "Comparing anything with <code>NULL</code> gives <b>unknown</b>, never true, and that holds even on the rows that are <code>NULL</code>. <code>WHERE</code> keeps a row only when its test is true, so you get <b>zero rows and no error message</b>." },
    { beat: "Step 3 · IS NULL", show: "nu-is", html: "<code>IS NULL</code> is the test built for this. It answers plain <b>TRUE</b> or <b>FALSE</b> on every row, and the three towns with no secondary county are kept." },
    { beat: "Step 4 · IS NOT NULL", show: "nu-isnot", html: "<code>IS NOT NULL</code> is the mirror image: it keeps the three towns that <b>do</b> cross into a second county." },
    { beat: "Step 5 · the quiet trap", show: "nu-neq", html: "<code>&lt;&gt; 'Polk'</code> reads like \"everything except Polk\", but the <code>NULL</code> rows test <b>unknown</b> and are dropped too. Two rows survive, not five. Add <code>OR secondary_county IS NULL</code> when you want them back." },
  ],
};

// ===========================================================================
// 7. ORDER BY with two columns
// ===========================================================================
const OB = [
  ["Salem", "OR", 175000],
  ["Seattle", "WA", 740000],
  ["Eugene", "OR", 176000],
  ["Spokane", "WA", 230000],
  ["Portland", "OR", 650000],
  ["Tacoma", "WA", 220000],
];
const OB_COLS = [
  { w: 150, label: "town" },
  { w: 90, label: "state" },
  { w: 130, label: "pop" },
];
const OB_Y = 70;
// Array.prototype.sort is stable, so ties keep their input order, which is the
// point step 2 makes.
const byState = (dir) => (a, b) => dir * a[1].localeCompare(b[1]);
const byStateThenPop = (dir) => (a, b) => dir * a[1].localeCompare(b[1]) || b[2] - a[2];

function obStage(el, ttl, rows, colored) {
  return lyr(
    el,
    grid(cx0(tw(OB_COLS)), OB_Y, ttl, OB_COLS, rows.map(([t, s, p]) => ({ cells: [{ t }, stateCell(s, colored), { t: String(p) }] }))).svg
  );
}

export const orderByAct = {
  id: "scrolly-order-by",
  title: "ORDER BY two columns: sort, then break ties",
  call: "SELECT town, state, pop\n  FROM towns\n ORDER BY state, pop DESC;",
  viewBox: `0 0 ${HERO_W} 390`,
  svg: [
    obStage("ob-raw", "no ORDER BY", OB, false),
    obStage("ob-state", "ORDER BY state", [...OB].sort(byState(1)), true),
    obStage("ob-both", "ORDER BY state, pop DESC", [...OB].sort(byStateThenPop(1)), true),
    obStage("ob-desc", "ORDER BY state DESC, pop DESC", [...OB].sort(byStateThenPop(-1)), true),
  ].join(""),
  steps: [
    { beat: "Step 1 · no ORDER BY", show: "ob-raw", html: "Without <code>ORDER BY</code>, rows come back in whatever order the database finds convenient. <b>No order is promised</b>, even if it looks stable today." },
    { beat: "Step 2 · the first sort key", show: "ob-state", html: "<code>ORDER BY state</code> puts <b>OR</b> ahead of <b>WA</b>. Inside each state the rows are <b>tied</b>, and SQL is free to leave ties in any order: Portland is last among the Oregon rows here." },
    { beat: "Step 3 · the second key breaks ties", show: "ob-both", html: "A second column sorts <b>only within the ties</b> left by the first. <code>pop DESC</code> orders each state from largest to smallest, and no Washington row ever moves above an Oregon row." },
    { beat: "Step 4 · DESC belongs to one column", show: "ob-desc", html: "<code>DESC</code> applies to the column it follows and nothing else. Each column is ascending unless it says otherwise, so reversing the states takes its own <code>DESC</code>." },
  ],
};

// ===========================================================================
// 8. Aggregates collapse a column (and skip NULL)
// ===========================================================================
const AG = [
  ["Polk", 20],
  ["Lane", 40],
  ["Wheeler", null],
  ["Benton", 10],
  ["Linn", 30],
];
const AG_COLS = [
  { w: 140, label: "county" },
  { w: 110, label: "area" },
];
const AG_Y = 64;
const AG_X0 = 60;
const AG_RX = 360;
const AG_RY = 110;
const AG_AREA_X = AG_X0 + AG_COLS[0].w;

function aggResult(labels, values) {
  return grid(AG_RX, AG_RY, "one row out", labels.map((label) => ({ w: 105, label })), [{ cells: values.map((t) => ({ t })) }]).svg;
}
const AG_NOTE_Y = AG_RY + 26 + RH + 34;

export const aggregateAct = {
  id: "scrolly-aggregates",
  title: "An aggregate turns a whole column into one value",
  call: "SELECT SUM(area), AVG(area),\n       MIN(area), MAX(area)\n  FROM counties;",
  viewBox: `0 0 ${HERO_W} 400`,
  svg: [
    NULLDEFS,
    `<g data-el="ag-base">${grid(AG_X0, AG_Y, "counties", AG_COLS, AG.map(([c, a]) => ({ cells: [{ t: c }, { t: a === null ? null : String(a) }] }))).svg}</g>`,
    lyr("ag-sum", aggResult(["SUM(area)"], ["100"]) + note(AG_RX, AG_NOTE_Y, "20 + 40 + 10 + 30 = 100, the NULL is skipped", "start")),
    lyr("ag-avg", aggResult(["SUM(area)", "AVG(area)"], ["100", "25"]) + note(AG_RX, AG_NOTE_Y, "100 / 4 = 25, divided by 4 values, not 5 rows", "start")),
    lyr(
      "ag-minmax",
      aggResult(["SUM(area)", "AVG(area)", "MIN(area)", "MAX(area)"], ["100", "25", "10", "40"]) +
        ring(AG_AREA_X, rowY(AG_Y, 3), AG_COLS[1].w) +
        ring(AG_AREA_X, rowY(AG_Y, 1), AG_COLS[1].w) +
        note(AG_RX, AG_NOTE_Y, "MIN and MAX each pick one existing value", "start")
    ),
    lyr(
      "ag-all",
      aggResult(["SUM(area)", "AVG(area)", "MIN(area)", "MAX(area)"], ["100", "25", "10", "40"]) +
        grid(AG_RX, AG_NOTE_Y + 40, "", [{ w: 105, label: "COUNT(*)" }, { w: 125, label: "COUNT(area)" }], [{ cells: [{ t: "5" }, { t: "4" }] }]).svg
    ),
  ].join(""),
  steps: [
    { beat: "Step 1 · five rows, one gap", show: "", html: "Five counties and their land areas. <b>Wheeler</b> has no area recorded, so that cell is <code>NULL</code>." },
    { beat: "Step 2 · SUM", show: "ag-sum", html: "<code>SUM(area)</code> adds the column into a single value, <b>100</b>. Five rows went in and <b>one row</b> came out. The <code>NULL</code> is skipped, not treated as zero." },
    { beat: "Step 3 · AVG skips NULL too", show: "ag-avg", html: "<code>AVG(area)</code> is 100 divided by the <b>4 values that exist</b>, which is <b>25</b>. Counting Wheeler as a zero would have given 20. A column with many <code>NULL</code>s can make an average describe fewer rows than you think." },
    { beat: "Step 4 · MIN and MAX", show: "ag-minmax", html: "<code>MIN</code> and <code>MAX</code> each pick one value that is already in the column (ringed in blue). They return the <b>value only</b>: the result has no county name, so you cannot tell from it that 10 belongs to Benton." },
    { beat: "Step 5 · all in one SELECT", show: "ag-all", html: "Every aggregate reads the same rows, so they can share one <code>SELECT</code> and still return one row. <code>COUNT(*)</code> says 5 and <code>COUNT(area)</code> says 4, which is how you spot the gap. With no <code>GROUP BY</code>, the whole table is a single group." },
  ],
};

// ===========================================================================
// 9. A subquery in WHERE
// ===========================================================================
const SQ = [
  ["Portland", "OR", 650000],
  ["Seattle", "WA", 740000],
  ["Astoria", "OR", 10000],
  ["Granite", "OR", 30],
  ["Spokane", "WA", 230000],
];
const SQ_COLS = [
  { w: 140, label: "town" },
  { w: 80, label: "state" },
  { w: 120, label: "pop" },
];
const SQ_Y = 64;
const SQ_X0 = 90;
const SQ_SX = SQ_X0 + tw(SQ_COLS) + 24;
const SQ_POP_X = SQ_X0 + SQ_COLS[0].w + SQ_COLS[1].w;
const SQ_MIN_ROW = 3;
const SQ_RES_Y = rowY(SQ_Y, SQ.length) + 56;

const sqInnerBox = grid(SQ_SX + 20, SQ_Y + 60, "inner query result", [{ w: 180, label: "MIN(pop)" }], [{ cells: [{ t: "30" }] }]).svg;

export const subqueryAct = {
  id: "scrolly-subquery",
  title: "A subquery runs first, then the outer query uses its answer",
  call: "SELECT town, state, pop\n  FROM towns\n WHERE pop = (SELECT MIN(pop) FROM towns);",
  viewBox: `0 0 ${HERO_W} ${SQ_RES_Y + 26 + RH + 24}`,
  svg: [
    `<g data-el="sq-base">${grid(SQ_X0, SQ_Y, "", SQ_COLS, SQ.map(([t, s, p]) => ({ cells: [{ t }, { t: s }, { t: String(p) }] }))).svg}</g>`,
    lyr("sq-inner", title("first: SELECT MIN(pop) FROM towns") + sqInnerBox + ring(SQ_POP_X, rowY(SQ_Y, SQ_MIN_ROW), SQ_COLS[2].w)),
    lyr(
      "sq-sub",
      title("the parentheses are replaced by 30") +
        sqInnerBox +
        note(SQ_SX + 110, SQ_Y + 60 + 26 + RH + 36, "so the outer query reads") +
        `<text x="${SQ_SX + 110}" y="${SQ_Y + 60 + 26 + RH + 68}" class="d-rttl" text-anchor="middle">WHERE pop = 30</text>`
    ),
    lyr("sq-outer", title("then: WHERE pop = 30, row by row") + sideCol(SQ_SX, SQ_Y, 150, "pop = 30 ?", SQ.map(([, , p]) => keepDrop(p === 30)))),
    lyr(
      "sq-res",
      grid(SQ_X0, SQ_RES_Y, "result", SQ_COLS, [{ cells: [{ t: "Granite" }, { t: "OR" }, { t: "30" }] }]).svg
    ),
  ].join(""),
  steps: [
    { beat: "Step 1 · two questions in one", show: "", html: "\"Which town is the smallest?\" hides two questions: what <b>is</b> the smallest population, and <b>which row</b> has it. <code>MIN(pop)</code> alone answers the first and loses the town's name." },
    { beat: "Step 2 · the inner query runs first", show: "sq-inner", html: "The <code>SELECT</code> inside the parentheses runs <b>on its own, first</b>. It scans every <code>pop</code> and returns a single value: <b>30</b>." },
    { beat: "Step 3 · its answer is dropped in", show: "sq-sub", html: "That value takes the place of the parentheses. From here on, the outer query behaves exactly as if you had typed <code>WHERE pop = 30</code>, except that you never had to know the number." },
    { beat: "Step 4 · the outer query filters", show: "sq-outer", html: "Now an ordinary <code>WHERE</code> checks each row against 30. Only <b>Granite</b> passes." },
    { beat: "Step 5 · the whole row comes back", show: "sq-outer,sq-res", html: "The result has the <b>town, state, and population</b>, not only the number. Writing <code>WHERE pop = MIN(pop)</code> is an error: <code>WHERE</code> tests one row at a time, before any aggregate exists. The subquery computes the aggregate separately and hands back a plain value." },
  ],
};

// ===========================================================================
// 10. CASE WHEN: first match wins
// ===========================================================================
const CW = [
  ["Portland", 650000],
  ["Bend", 99000],
  ["Astoria", 10000],
  ["Granite", 30],
];
const CW_COLS = [
  { w: 120, label: "town" },
  { w: 110, label: "pop" },
];
const CW_Y = 64;
const CW_TW = 125;
const CW_RW = 150;
const CW_X0 = cx0(tw(CW_COLS) + 14 + 3 * CW_TW + 14 + CW_RW);
const CW_TX = CW_X0 + tw(CW_COLS) + 14;
const CW_RX = CW_TX + 3 * CW_TW + 14;
const CAT = {
  "Large City": { fill: "#C0562F", white: true },
  "Medium City": { fill: "#6FB5DF" },
  "Small City": { fill: "#EFD46A" },
  Town: { fill: "#F7E3C1" },
};
const CW_TESTS = [
  [100000, "Large City"],
  [25000, "Medium City"],
  [5000, "Small City"],
];

// A full-state layer: the first `n` rows evaluated against `tests`, top to bottom.
function caseLayer(el, ttl, tests, n) {
  const cols = tests.map(() => []);
  const result = [];
  CW.forEach(([, pop], i) => {
    if (i >= n) {
      cols.forEach((c) => c.push(null));
      result.push(null);
      return;
    }
    let label = null;
    tests.forEach(([min, name], ti) => {
      if (label) cols[ti].push({ t: "not checked", kind: "skip" });
      else if (pop >= min) {
        cols[ti].push({ t: "✓", kind: "ok" });
        label = name;
      } else cols[ti].push({ t: "✗", kind: "no" });
    });
    label ??= "Town";
    result.push({ t: label, ...CAT[label] });
  });
  return lyr(
    el,
    title(ttl) +
      tests.map(([min], ti) => sideCol(CW_TX + ti * CW_TW, CW_Y, CW_TW, `${ti + 1}. pop >= ${min}`, cols[ti])).join("") +
      sideCol(CW_RX, CW_Y, CW_RW, "size_category", result)
  );
}

export const caseWhenAct = {
  id: "scrolly-case-when",
  title: "CASE WHEN: the first test that passes wins",
  call: "CASE\n  WHEN pop >= 100000 THEN 'Large City'\n  WHEN pop >= 25000  THEN 'Medium City'\n  WHEN pop >= 5000   THEN 'Small City'\n  ELSE 'Town'\nEND AS size_category",
  viewBox: `0 0 ${HERO_W} 300`,
  // The correct, fully evaluated table is what the gallery and print should show.
  thumb: "cw-3",
  svg: [
    `<g data-el="cw-base">${grid(CW_X0, CW_Y, "", CW_COLS, CW.map(([t, p]) => ({ cells: [{ t }, { t: String(p) }] }))).svg}</g>`,
    caseLayer("cw-rev", "same tests, smallest threshold first", [...CW_TESTS].reverse(), CW.length),
    caseLayer("cw-1", "tests run top to bottom, one row at a time", CW_TESTS, 1),
    caseLayer("cw-2", "tests run top to bottom, one row at a time", CW_TESTS, 2),
    caseLayer("cw-3", "tests run top to bottom, one row at a time", CW_TESTS, CW.length),
  ].join(""),
  steps: [
    { beat: "Step 1 · a new column from rules", show: "", html: "<code>CASE</code> builds a column by running each row through a list of <code>WHEN</code> tests. The tests are tried <b>in the order you wrote them</b>." },
    { beat: "Step 2 · first match wins", show: "cw-1", html: "<b>Portland</b> passes test 1, so it becomes <code>'Large City'</code> and <code>CASE</code> <b>stops there</b>. Tests 2 and 3 are never checked for this row, even though Portland would pass them as well." },
    { beat: "Step 3 · fall through", show: "cw-2", html: "<b>Bend</b> fails test 1 and falls through to test 2, which it passes: <code>'Medium City'</code>. Reaching test 2 already tells you the row is under 100000, so no upper bound is needed." },
    { beat: "Step 4 · ELSE catches the rest", show: "cw-3", html: "<b>Astoria</b> gets as far as test 3. <b>Granite</b> fails every test and lands on <code>ELSE</code>. Leave <code>ELSE</code> out and Granite's category would be <code>NULL</code>." },
    { beat: "Step 5 · why the order matters", show: "cw-rev", html: "Put the smallest threshold first and <b>Portland passes it immediately</b>, so every city is labeled <code>'Small City'</code>. SQL raises no error. With overlapping ranges, write the most restrictive test first." },
  ],
};

// ===========================================================================
// 11. Computed columns and integer division
// ===========================================================================
const ID_ROWS = [
  ["Sisters", 1000, 1150],
  ["Joseph", 1000, 1234],
  ["Fossil", 1000, 950],
];
const ID_COLS = [
  { w: 110, label: "town" },
  { w: 100, label: "pop_2010" },
  { w: 100, label: "pop_2020" },
];
const ID_Y = 70;
const ID_X0 = 14;
const ID_CX = ID_X0 + tw(ID_COLS) + 12;
const ID_W = [110, 160, 205];
const pct = (a, b) => (((b - a) * 100) / a).toFixed(1);

export const integerDivisionAct = {
  id: "scrolly-integer-division",
  title: "A computed column, and why the query says 100.0",
  call: "SELECT town,\n       pop_2020 - pop_2010 AS change,\n       ROUND((pop_2020 - pop_2010) * 100.0 / pop_2010, 1) AS pct_change\n  FROM towns;",
  viewBox: `0 0 ${HERO_W} 260`,
  svg: [
    `<g data-el="id-base">${grid(ID_X0, ID_Y, "towns", ID_COLS, ID_ROWS.map(([t, a, b]) => ({ cells: [{ t }, { t: String(a) }, { t: String(b) }] }))).svg}</g>`,
    lyr("id-change", sideCol(ID_CX, ID_Y, ID_W[0], "change", ID_ROWS.map(([, a, b]) => ({ t: String(b - a) })))),
    lyr("id-int", sideCol(ID_CX + ID_W[0], ID_Y, ID_W[1], "change / pop_2010", ID_ROWS.map(([, a, b]) => ({ t: String(Math.trunc((b - a) / a)), kind: "no" })))),
    lyr("id-real", sideCol(ID_CX + ID_W[0] + ID_W[1], ID_Y, ID_W[2], "change * 100.0 / pop_2010", ID_ROWS.map(([, a, b]) => ({ t: pct(a, b), kind: "ok" })))),
  ].join(""),
  steps: [
    { beat: "Step 1 · two census columns", show: "", html: "Each town has a 2010 and a 2020 population. The table stores no growth figure, so the query has to compute one." },
    { beat: "Step 2 · arithmetic runs per row", show: "id-change", html: "<code>pop_2020 - pop_2010</code> is worked out <b>once for every row</b>. The new <code>change</code> column exists only in the result, and the table is not modified." },
    { beat: "Step 3 · the division trap", show: "id-change,id-int", html: "Dividing one whole number by another gives a <b>whole number</b> in SQLite and several other databases: the fraction is thrown away. 150 / 1000 becomes <b>0</b>, and so does every other row. There is no error, only a column of zeros." },
    { beat: "Step 4 · 100.0 fixes it", show: "id-change,id-int,id-real", html: "Multiply by <code>100.0</code> <b>before</b> dividing. The decimal point makes the whole calculation use real numbers, giving <b>15.0</b>, <b>23.4</b>, and <b>-5.0</b>. <code>ROUND(..., 1)</code> then trims it for display." },
  ],
};

// ===========================================================================
// 12. COUNT after a LEFT JOIN
// ===========================================================================
const CJ_FILL = { Lane: "#EFD46A", Polk: "#6FB5DF", Wheeler: "#C0562F" };
const CJ = [
  ["Lane", "Eugene"],
  ["Lane", "Springfield"],
  ["Polk", "Dallas"],
  ["Wheeler", null],
];
const CJ_COLS = [
  { w: 130, label: "c.county" },
  { w: 160, label: "t.town" },
];
const CJ_Y = 70;
const cjCounty = (c, colored) => ({ t: c, fill: colored ? CJ_FILL[c] : "#fff", white: colored && c === "Wheeler" });

function cjJoined(el, ttl, colored) {
  return lyr(el, grid(cx0(tw(CJ_COLS)), CJ_Y, ttl, CJ_COLS, CJ.map(([c, t]) => ({ cells: [cjCounty(c, colored), { t }] }))).svg);
}
function cjCounted(el, label, wheeler, color) {
  const cols = [
    { w: 130, label: "c.county" },
    { w: 160, label },
  ];
  const rows = [
    ["Lane", "2"],
    ["Polk", "1"],
    ["Wheeler", wheeler],
  ].map(([c, n]) => ({ cells: [cjCounty(c, true), { t: n, hl: c === "Wheeler" ? color : undefined }] }));
  return lyr(el, grid(cx0(tw(cols)), CJ_Y, `GROUP BY c.county, then ${label}`, cols, rows).svg);
}

export const countJoinAct = {
  id: "scrolly-count-after-left-join",
  title: "Counting after a LEFT JOIN: COUNT(*) versus COUNT(t.town)",
  call: "SELECT c.county, COUNT(t.town) AS num_towns\n  FROM counties AS c\n  LEFT JOIN towns AS t ON c.county = t.county\n GROUP BY c.county;",
  viewBox: `0 0 ${HERO_W} 310`,
  svg: [
    NULLDEFS,
    cjJoined("cj-joined", "counties LEFT JOIN towns", false),
    cjJoined("cj-group", "GROUP BY c.county", true),
    cjCounted("cj-star", "COUNT(*)", "1", RING_NO),
    cjCounted("cj-col", "COUNT(t.town)", "0", RING_OK),
  ].join(""),
  steps: [
    { beat: "Step 1 · the joined rows", show: "cj-joined", html: "A <code>LEFT JOIN</code> keeps every county. <b>Wheeler</b> has no towns in the table, so it still gets <b>one row</b>, with <code>NULL</code> where the town would be." },
    { beat: "Step 2 · group by county", show: "cj-group", html: "<code>GROUP BY c.county</code> makes three groups. Wheeler's group holds exactly one row: the placeholder the join created." },
    { beat: "Step 3 · COUNT(*) overcounts", show: "cj-star", html: "<code>COUNT(*)</code> counts rows, and Wheeler's placeholder <b>is a row</b>. The report says Wheeler has <b>1</b> town (ringed in red). It has none." },
    { beat: "Step 4 · count the right-side column", show: "cj-col", html: "<code>COUNT(t.town)</code> skips <code>NULL</code>, so the placeholder adds nothing and Wheeler correctly shows <b>0</b>. After a <code>LEFT JOIN</code>, count a column from the <b>right-hand</b> table, not <code>*</code>." },
  ],
};
