// Data for the scroll-driven join diagrams.
//
// Each exported "act" is { title, call, viewBox, svg, steps } where `svg` is an
// inline SVG whose layers carry `data-el` ids, and `steps` lists which ids each
// scroll step reveals (see src/lib/scrolly.ts). The visual language matches the
// static join PNGs in scripts/gen_join_diagrams.mjs: colored key chips, thick
// match arrows, open-circle dead ends for no-match rows, faded rows for anything
// a join drops, and a dark gradient for NULL. Abstract keys (L1-L4 / R1-R4) are
// used deliberately so the diagram teaches the mechanism, not one dataset.

// ---- geometry ----
const RH = 46;
const IDW = 74;
const VALW = 96;
const LX = 60;
const RX = 620;
const ROW_Y0 = 80;
const HDR_Y = 70;
const L_EDGE = LX + IDW + VALW; // 230
const W = 800;

const C = { 1: "#EFD46A", 2: "#6FB5DF", 3: "#C0562F", 4: "#B678A8", 5: "#F7E3C1", 6: "#A5E07E" };
const STROKE = { 5: "#D9A94E", 6: "#5FA83C" }; // darker markers for the pale chips
const WHITE_TEXT = new Set([3]); // dark chips get white id text

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const midY = (i) => ROW_Y0 + i * RH + RH / 2;

const DEFS =
  `<defs><linearGradient id="nullfill" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="#2f2f2f"/><stop offset="0.5" stop-color="#c9c9c9"/><stop offset="1" stop-color="#3a3a3a"/>` +
  `</linearGradient></defs>`;

function sourceTable(prefix, x, title, rows, drops = []) {
  const anchor = prefix === "L" ? "start" : "end";
  const tx = prefix === "L" ? x : x + IDW + VALW;
  const parts = [
    `<text x="${tx}" y="40" class="d-ttl" text-anchor="${anchor}">${esc(title)}</text>`,
    `<text x="${x + IDW / 2}" y="${HDR_Y}" class="d-hdr" text-anchor="middle">id</text>`,
    `<text x="${x + IDW + VALW / 2}" y="${HDR_Y}" class="d-hdr" text-anchor="middle">val</text>`,
    `<rect class="scan" x="${x - 4}" y="${ROW_Y0 - 2}" width="${IDW + 8}" height="${rows.length * RH + 4}" rx="6" fill="#1b6ca8" fill-opacity="0.14" stroke="#1b6ca8" stroke-dasharray="5 4"/>`,
  ];
  rows.forEach(([id, val], i) => {
    const y = ROW_Y0 + i * RH;
    const cls = drops.includes(i) ? ' class="drop"' : "";
    const idFill = WHITE_TEXT.has(id) ? ' fill="#fff"' : "";
    parts.push(
      `<g data-el="${prefix}-${i}"${cls}>` +
        `<rect x="${x}" y="${y}" width="${IDW}" height="${RH}" fill="${C[id]}" stroke="#111" stroke-width="2.5"/>` +
        `<text x="${x + IDW / 2}" y="${y + RH / 2 + 7}" class="d-cell" text-anchor="middle"${idFill}>${id}</text>` +
        `<rect x="${x + IDW}" y="${y}" width="${VALW}" height="${RH}" fill="#fff" stroke="#111" stroke-width="2.5"/>` +
        `<text x="${x + IDW + VALW / 2}" y="${y + RH / 2 + 7}" class="d-cell" text-anchor="middle">${esc(val)}</text>` +
        `</g>`
    );
  });
  return parts.join("");
}

function matchArrow(idx, li, rj, colorKey) {
  const x1 = L_EDGE + 10;
  const y1 = midY(li);
  const x2 = RX - 10;
  const y2 = midY(rj);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hl = 18;
  const hw = 11;
  const bx = x2 - hl * Math.cos(ang);
  const by = y2 - hl * Math.sin(ang);
  const px = -Math.sin(ang);
  const py = Math.cos(ang);
  const head =
    `${x2.toFixed(1)},${y2.toFixed(1)} ` +
    `${(bx + hw * px).toFixed(1)},${(by + hw * py).toFixed(1)} ` +
    `${(bx - hw * px).toFixed(1)},${(by - hw * py).toFixed(1)}`;
  return (
    `<line class="arrow" data-el="arw-${idx}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C[colorKey]}" stroke-width="9" stroke-linecap="round" pathLength="1"/>` +
    `<polygon class="arrowhead" data-el="arh-${idx}" points="${head}" fill="${C[colorKey]}" stroke="#111" stroke-width="1"/>`
  );
}

function stubL(i, id) {
  const y = midY(i);
  const color = STROKE[id] ?? C[id];
  const x1 = L_EDGE + 10;
  const x2 = x1 + 52;
  return (
    `<g class="lyr" data-el="stubL-${i}">` +
    `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="8" stroke-linecap="round"/>` +
    `<circle cx="${x2 + 12}" cy="${y}" r="11" fill="#fff" stroke="${color}" stroke-width="5"/></g>`
  );
}

function stubR(j, id) {
  const y = midY(j);
  const color = STROKE[id] ?? C[id];
  const x1 = RX - 10;
  const x2 = x1 - 52;
  return (
    `<g class="lyr" data-el="stubR-${j}">` +
    `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="8" stroke-linecap="round"/>` +
    `<circle cx="${x2 - 12}" cy="${y}" r="11" fill="#fff" stroke="${color}" stroke-width="5"/></g>`
  );
}

function resultTable(title, cols, colw, rows) {
  const CX = 400;
  const TW = colw.reduce((a, b) => a + b, 0);
  const x0 = CX - TW / 2;
  const parts = [
    `<g class="lyr" data-el="res"><text x="${CX}" y="330" class="d-rttl" text-anchor="middle">${esc(title)}</text>`,
  ];
  let cx = x0;
  cols.forEach((c, ci) => {
    parts.push(`<text x="${cx + colw[ci] / 2}" y="360" class="d-hdr" text-anchor="middle">${esc(c)}</text>`);
    cx += colw[ci];
  });
  parts.push(`</g>`);
  rows.forEach((row, ri) => {
    const y = 372 + ri * RH;
    let cx2 = x0;
    const cells = row.cells
      .map((cell, ci) => {
        const w = colw[ci];
        let s;
        if (cell === null) {
          s =
            `<rect x="${cx2}" y="${y}" width="${w}" height="${RH}" fill="url(#nullfill)" stroke="#111" stroke-width="2.5"/>` +
            `<text x="${cx2 + w / 2}" y="${y + RH / 2 + 6}" class="d-nan" text-anchor="middle">NULL</text>`;
        } else {
          const fill = ci === 0 ? C[row.key] : "#fff";
          const wt = ci === 0 && WHITE_TEXT.has(row.key) ? ' fill="#fff"' : "";
          s =
            `<rect x="${cx2}" y="${y}" width="${w}" height="${RH}" fill="${fill}" stroke="#111" stroke-width="2.5"/>` +
            `<text x="${cx2 + w / 2}" y="${y + RH / 2 + 7}" class="d-cell" text-anchor="middle"${wt}>${esc(cell)}</text>`;
        }
        cx2 += w;
        return s;
      })
      .join("");
    parts.push(`<g class="lyr" data-el="resrow-${ri}">${cells}</g>`);
  });
  return { svg: parts.join(""), bottom: 372 + rows.length * RH };
}

// Assemble a two-table join panel with a result underneath.
function joinPanel(spec) {
  const parts = [DEFS];
  parts.push(sourceTable("L", LX, spec.leftTitle ?? "left_table", spec.left, spec.dropL ?? []));
  parts.push(sourceTable("R", RX, spec.rightTitle ?? "right_table", spec.right, spec.dropR ?? []));
  (spec.arrows ?? []).forEach(([li, rj], idx) => parts.push(matchArrow(idx, li, rj, spec.left[li][0])));
  (spec.stubL ?? []).forEach((i) => parts.push(stubL(i, spec.left[i][0])));
  (spec.stubR ?? []).forEach((j) => parts.push(stubR(j, spec.right[j][0])));
  const res = resultTable(spec.result.title, spec.result.cols, spec.result.colw, spec.result.rows);
  parts.push(res.svg);
  const H = res.bottom + 26;
  return { viewBox: `0 0 ${W} ${H}`, svg: parts.join("") };
}

// ---- shared row data ----
const LEFT = [
  [1, "L1"],
  [2, "L2"],
  [3, "L3"],
  [4, "L4"],
];
const RIGHT = [
  [1, "R1"],
  [4, "R2"],
  [5, "R3"],
  [6, "R4"],
];
const RIGHT_DUP = [
  [1, "R1"],
  [1, "R2"],
  [4, "R3"],
  [5, "R4"],
  [6, "R5"],
];
const COLS3 = ["id", "L.val", "R.val"];
const W3 = [IDW, VALW, VALW];

// ---- INNER JOIN ----
const innerPanel = joinPanel({
  left: LEFT,
  right: RIGHT,
  arrows: [
    [0, 0],
    [3, 1],
  ],
  stubL: [1, 2],
  stubR: [2, 3],
  dropL: [1, 2],
  dropR: [2, 3],
  result: {
    title: "INNER JOIN result",
    cols: COLS3,
    colw: W3,
    rows: [
      { key: 1, cells: [1, "L1", "R1"] },
      { key: 4, cells: [4, "L4", "R2"] },
    ],
  },
});

export const innerAct = {
  title: "INNER JOIN: keep only matched rows",
  call: "SELECT * FROM left_table AS l INNER JOIN right_table AS r ON l.id = r.id;",
  viewBox: innerPanel.viewBox,
  svg: innerPanel.svg,
  steps: [
    { beat: "Step 1 · the tables", show: "", html: "Two tables sharing an <code>id</code> key. Each key value has its own color so you can trace it. Keys <b>1</b> and <b>4</b> live in both; <b>2</b> and <b>3</b> are left-only; <b>5</b> and <b>6</b> are right-only." },
    { beat: "Step 2 · the scan", show: "scan", html: "An inner join walks the <code>id</code> column on both sides and asks one question of every value: <b>does this key appear on the other side?</b>" },
    { beat: "Step 3 · first match", show: "arw-0,arh-0,res,resrow-0", html: "Key <b>1</b> is in both tables, so the rows join and the first result row appears, carrying <code>val</code> from each side." },
    { beat: "Step 4 · second match", show: "arw-0,arh-0,arw-1,arh-1,res,resrow-0,resrow-1", html: "Key <b>4</b> matches too. The arrow crosses rows: position does not matter, only the key does." },
    { beat: "Step 5 · left rows with no match", show: "arw-0,arh-0,arw-1,arh-1,res,resrow-0,resrow-1,stubL-1,stubL-2,drop-L-1,drop-L-2", html: "Keys <b>2</b> and <b>3</b> look for a match on the right and find none (the open circles). An inner join <b>drops</b> them." },
    { beat: "Step 6 · right rows with no match", show: "arw-0,arh-0,arw-1,arh-1,res,resrow-0,resrow-1,stubL-1,stubL-2,stubR-2,stubR-3,drop-L-1,drop-L-2,drop-R-2,drop-R-3", html: "Keys <b>5</b> and <b>6</b> exist only on the right, so an inner join drops them as well. Unmatched on <em>either</em> side is gone." },
    { beat: "Step 7 · the result", show: "arw-0,arh-0,arw-1,arh-1,res,resrow-0,resrow-1,drop-L-1,drop-L-2,drop-R-2,drop-R-3", html: "Two tables in, <b>two matched rows out</b>. An inner join is the intersection: only keys on both sides survive." },
  ],
};

// ---- LEFT JOIN ----
const leftPanel = joinPanel({
  left: LEFT,
  right: RIGHT,
  arrows: [
    [0, 0],
    [3, 1],
  ],
  stubL: [1, 2],
  stubR: [2, 3],
  dropR: [2, 3],
  result: {
    title: "LEFT JOIN result",
    cols: COLS3,
    colw: W3,
    rows: [
      { key: 1, cells: [1, "L1", "R1"] },
      { key: 2, cells: [2, "L2", null] },
      { key: 3, cells: [3, "L3", null] },
      { key: 4, cells: [4, "L4", "R2"] },
    ],
  },
});

export const leftAct = {
  title: "LEFT JOIN: keep every left row",
  call: "SELECT * FROM left_table AS l LEFT JOIN right_table AS r ON l.id = r.id;",
  viewBox: leftPanel.viewBox,
  svg: leftPanel.svg,
  steps: [
    { beat: "Step 1 · the rule", show: "", html: "Same two tables, new rule: <b>keep every left row</b>, matched or not. The left table is the one we protect." },
    { beat: "Step 2 · the matches", show: "arw-0,arh-0,arw-1,arh-1,res,resrow-0,resrow-3", html: "Keys <b>1</b> and <b>4</b> match as before, and their result rows come across complete with <code>val</code> from both sides." },
    { beat: "Step 3 · no match, but kept", show: "arw-0,arh-0,arw-1,arh-1,stubL-1,stubL-2,res,resrow-0,resrow-1,resrow-2,resrow-3", html: "Keys <b>2</b> and <b>3</b> find nothing on the right (open circles), but a left join <b>keeps them anyway</b> and fills the right columns with <code>NULL</code> (the dark cells)." },
    { beat: "Step 4 · right rows with no match", show: "arw-0,arh-0,arw-1,arh-1,stubL-1,stubL-2,stubR-2,stubR-3,res,resrow-0,resrow-1,resrow-2,resrow-3,drop-R-2,drop-R-3", html: "Keys <b>5</b> and <b>6</b> exist only on the right. A left join does not keep extra right rows, so they are <b>dropped</b>." },
    { beat: "Step 5 · the result", show: "arw-0,arh-0,arw-1,arh-1,res,resrow-0,resrow-1,resrow-2,resrow-3,drop-R-2,drop-R-3", html: "<b>Four rows out</b>, one per left row, two of them carrying <code>NULL</code>. A left join never loses a row from the left table, but it can hand you missing values to reckon with." },
  ],
};

// ---- LEFT JOIN with a one-to-many match ----
const multiPanel = joinPanel({
  left: LEFT,
  right: RIGHT_DUP,
  rightTitle: "right_dup",
  arrows: [
    [0, 0],
    [0, 1],
    [3, 2],
  ],
  stubL: [1, 2],
  stubR: [3, 4],
  dropR: [3, 4],
  result: {
    title: "LEFT JOIN result",
    cols: COLS3,
    colw: W3,
    rows: [
      { key: 1, cells: [1, "L1", "R1"] },
      { key: 1, cells: [1, "L1", "R2"] },
      { key: 2, cells: [2, "L2", null] },
      { key: 3, cells: [3, "L3", null] },
      { key: 4, cells: [4, "L4", "R3"] },
    ],
  },
});

export const multiAct = {
  title: "One row, many matches: the join multiplies",
  call: "-- right_dup has key 1 twice\nSELECT * FROM left_table AS l LEFT JOIN right_dup AS r ON l.id = r.id;",
  viewBox: multiPanel.viewBox,
  svg: multiPanel.svg,
  steps: [
    { beat: "Step 1 · a duplicated key", show: "", html: "Here the right table has key <b>1</b> <em>twice</em> (<code>R1</code> and <code>R2</code>). This is the case that quietly inflates row counts." },
    { beat: "Step 2 · one-to-many", show: "arw-0,arh-0,arw-1,arh-1,res,resrow-0,resrow-1", html: "Left key <b>1</b> matches <em>both</em> right rows, so it produces <b>two</b> result rows. One left row became two: the join multiplied it." },
    { beat: "Step 3 · the other match", show: "arw-0,arh-0,arw-1,arh-1,arw-2,arh-2,res,resrow-0,resrow-1,resrow-4", html: "Key <b>4</b> matches a single right row, so it stays one row. Only the duplicated key multiplied." },
    { beat: "Step 4 · no match, but kept", show: "arw-0,arh-0,arw-1,arh-1,arw-2,arh-2,stubL-1,stubL-2,res,resrow-0,resrow-1,resrow-2,resrow-3,resrow-4", html: "Keys <b>2</b> and <b>3</b> still have no match and are kept with <code>NULL</code>, exactly as a plain left join." },
    { beat: "Step 5 · the result", show: "arw-0,arh-0,arw-1,arh-1,arw-2,arh-2,stubL-1,stubL-2,stubR-3,stubR-4,res,resrow-0,resrow-1,resrow-2,resrow-3,resrow-4,drop-R-3,drop-R-4", html: "<b>Five rows out</b> from four left rows. If you were counting or summing, that extra <code>L1</code> row double-counts. This is why you check the key is unique on the side you join to." },
  ],
};

// ---- ANTI-JOIN ----
const antiPanel = joinPanel({
  left: LEFT,
  right: RIGHT,
  arrows: [
    [0, 0],
    [3, 1],
  ],
  stubL: [1, 2],
  dropL: [0, 3],
  dropR: [0, 1, 2, 3],
  result: {
    title: "Anti-join result",
    cols: ["id", "L.val"],
    colw: [IDW, VALW],
    rows: [
      { key: 2, cells: [2, "L2"] },
      { key: 3, cells: [3, "L3"] },
    ],
  },
});

export const antiAct = {
  title: "Anti-join: keep only the left rows with no match",
  call: "SELECT l.* FROM left_table AS l\n LEFT JOIN right_table AS r ON l.id = r.id\n WHERE r.id IS NULL;",
  viewBox: antiPanel.viewBox,
  svg: antiPanel.svg,
  steps: [
    { beat: "Step 1 · start from a left join", show: "", html: "An anti-join is a left join with a twist. First, line up the two tables the same way." },
    { beat: "Step 2 · the matches", show: "arw-0,arh-0,arw-1,arh-1", html: "Keys <b>1</b> and <b>4</b> match on the right. These are exactly the rows an anti-join wants to <em>throw away</em>." },
    { beat: "Step 3 · the non-matches", show: "arw-0,arh-0,arw-1,arh-1,stubL-1,stubL-2", html: "Keys <b>2</b> and <b>3</b> have no match on the right (open circles). After a left join, their right columns are <code>NULL</code>." },
    { beat: "Step 4 · WHERE r.id IS NULL", show: "arw-0,arh-0,arw-1,arh-1,stubL-1,stubL-2,drop-L-0,drop-L-3,drop-R-0,drop-R-1,drop-R-2,drop-R-3,res,resrow-0,resrow-1", html: "The <code>WHERE r.id IS NULL</code> filter keeps only the rows whose right side never matched. The matched rows drop out, and you are left with the left-only keys <b>2</b> and <b>3</b>." },
  ],
};
