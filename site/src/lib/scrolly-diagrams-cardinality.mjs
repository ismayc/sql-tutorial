// Scroll-driven diagrams for cardinality: how to read the ends of an ERD line.
//
// Same act shape as scrolly-diagrams.mjs ({ id, title, call, viewBox, svg, steps }).
// These use real rows from pnw_database.sqlite (checked with sqlite3 on
// October 8, 2026) so the picture is the evidence: a county's key chip sits next
// to the line, the town's matching chip sits at the other end, and the marks on
// the summary line at the bottom are read off the lines above them.
//
// Facts the steps rely on (whole tables, not just the rows drawn):
// - every town has a primary_county_id (0 NULLs out of 453);
// - a county has 0 to 34 primary towns; San Juan and Wahkiakum have 0 in any column;
// - county_seat_town_id is NULL for 5 counties and no town is the seat of two;
// - 20 towns have a secondary county and 2 a tertiary one: 475 town-county pairs.

const W = 800;
const PITCH = 56;
const RH = 44;
const TOP = 96;
const INK = "#10283d";

const C = { 1: "#EFD46A", 2: "#6FB5DF", 3: "#C0562F", 4: "#B678A8", 5: "#A5E07E", 6: "#F2A65A", 7: "#8FD3C7" };
const WHITE_TEXT = new Set([3]);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// One row box: an array of cells { t, w, key? } laid out left to right.
function rowBox(x, y, cells) {
  let cx = x;
  return cells
    .map((c) => {
      const fill = c.key ? C[c.key] : c.null ? "url(#cardnull)" : "#fff";
      const txt = c.null
        ? `<text x="${cx + c.w / 2}" y="${y + RH / 2 + 5}" class="d-nan" text-anchor="middle">NULL</text>`
        : `<text x="${cx + c.w / 2}" y="${y + RH / 2 + 7}" class="d-cell" text-anchor="middle"${c.key && WHITE_TEXT.has(c.key) ? ' fill="#fff"' : ""}>${esc(c.t)}</text>`;
      const s = `<rect x="${cx}" y="${y}" width="${c.w}" height="${RH}" fill="${fill}" stroke="#111" stroke-width="2.5"/>` + txt;
      cx += c.w;
      return s;
    })
    .join("");
}
const width = (cells) => cells.reduce((a, c) => a + c.w, 0);

// Crow's foot marks at an entity edge. `out` is +1 when the line leaves the
// entity to the right, -1 when it leaves to the left. Nearest the entity is the
// maximum (bar = one, fan = many); further out is the minimum (circle = zero).
function mark(ex, y, out, kind) {
  const at = (d) => ex + out * d;
  const bar = (d) => `<line x1="${at(d)}" y1="${y - 12}" x2="${at(d)}" y2="${y + 12}" stroke="${INK}" stroke-width="3"/>`;
  const ring = (d) => `<circle cx="${at(d)}" cy="${y}" r="8" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  const fan =
    `<line x1="${at(22)}" y1="${y}" x2="${ex}" y2="${y - 14}" stroke="${INK}" stroke-width="3"/>` +
    `<line x1="${at(22)}" y1="${y}" x2="${ex}" y2="${y}" stroke="${INK}" stroke-width="3"/>` +
    `<line x1="${at(22)}" y1="${y}" x2="${ex}" y2="${y + 14}" stroke="${INK}" stroke-width="3"/>`;
  if (kind === "one") return bar(10) + bar(19);
  if (kind === "zeroOne") return bar(12) + ring(32);
  if (kind === "zeroMany") return fan + ring(34);
  if (kind === "oneMany") return fan + bar(30);
  return "";
}

const DEFS =
  `<defs><linearGradient id="cardnull" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="#2f2f2f"/><stop offset="0.5" stop-color="#c9c9c9"/><stop offset="1" stop-color="#3a3a3a"/>` +
  `</linearGradient></defs>`;

// Two columns of rows joined by lines, plus a summary ERD strip at the bottom.
// spec: { lt, rt, lhdr, rhdr, left: [cells], right: [cells], links: [{ id, l, r, key, dash? }],
//         badges: [{ id, i, t, bad? }], summary: [...entities], marks: [{ id, ... }], notes: [{ id, ... }] }
function panel(spec) {
  const LX = 60;
  const lw = width(spec.left[0]);
  const rw = width(spec.right[0]);
  const RX = W - 60 - rw;
  const n = Math.max(spec.left.length, spec.right.length);
  const lOff = ((n - spec.left.length) * PITCH) / 2;
  const rOff = ((n - spec.right.length) * PITCH) / 2;
  const ly = (i) => TOP + lOff + i * PITCH;
  const ry = (j) => TOP + rOff + j * PITCH;
  const parts = [
    DEFS,
    `<text x="${LX}" y="44" class="d-ttl">${esc(spec.lt)}</text>`,
    `<text x="${RX + rw}" y="44" class="d-ttl" text-anchor="end">${esc(spec.rt)}</text>`,
    `<text x="${LX}" y="76" class="d-hdr">${esc(spec.lhdr)}</text>`,
    `<text x="${RX + rw}" y="76" class="d-hdr" text-anchor="end">${esc(spec.rhdr)}</text>`,
  ];
  spec.left.forEach((cells, i) => parts.push(`<g data-el="L-${i}">${rowBox(LX, ly(i), cells)}</g>`));
  spec.right.forEach((cells, j) => parts.push(`<g data-el="R-${j}">${rowBox(RX, ry(j), cells)}</g>`));
  (spec.links || []).forEach((k) => {
    const x1 = LX + lw + 8;
    const x2 = RX - 8;
    const y1 = ly(k.l) + RH / 2;
    const y2 = ry(k.r) + RH / 2;
    const dash = k.dash ? ` stroke-dasharray="${k.dash}"` : "";
    parts.push(
      `<g class="lyr" data-el="${k.id}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="9" stroke-linecap="round"${dash}/>` +
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C[k.key]}" stroke-width="6" stroke-linecap="round"${dash}/></g>`
    );
  });
  (spec.badges || []).forEach((b) => {
    const y = (b.side === "R" ? ry(b.i) : ly(b.i)) + RH / 2;
    const x = b.side === "R" ? RX + rw + 26 : LX - 26;
    const col = b.bad ? "#c0261a" : INK;
    parts.push(
      `<g class="lyr" data-el="${b.id}"><circle cx="${x}" cy="${y}" r="17" fill="#fff" stroke="${col}" stroke-width="3"/>` +
        // style, not a fill attribute: the .d-cell CSS rule outranks presentation attributes
        `<text x="${x}" y="${y + 7}" class="d-cell" text-anchor="middle" style="fill:${col}">${esc(b.t)}</text></g>`
    );
  });
  // Summary strip
  const sy = TOP + n * PITCH + 34;
  const smid = sy + RH / 2;
  parts.push(`<g class="lyr" data-el="sum"><text x="${W / 2}" y="${sy - 12}" class="d-hdr" text-anchor="middle">${esc(spec.sumTitle || "the same relationship on an ERD")}</text>`);
  spec.summary.forEach((e) => {
    parts.push(
      `<rect x="${e.x}" y="${sy}" width="${e.w}" height="${RH}" rx="6" fill="#fff" stroke="#111" stroke-width="2.5"/>` +
        `<text x="${e.x + e.w / 2}" y="${sy + RH / 2 + 7}" class="d-mono" text-anchor="middle">${esc(e.t)}</text>`
    );
  });
  for (let i = 0; i + 1 < spec.summary.length; i++) {
    const a = spec.summary[i];
    const b = spec.summary[i + 1];
    parts.push(`<line x1="${a.x + a.w}" y1="${smid}" x2="${b.x}" y2="${smid}" stroke="${INK}" stroke-width="3"/>`);
  }
  parts.push(`</g>`);
  (spec.marks || []).forEach((m) => {
    const e = spec.summary[m.at];
    const ex = m.out > 0 ? e.x + e.w : e.x;
    parts.push(`<g class="lyr" data-el="${m.id}">${mark(ex, smid, m.out, m.kind)}</g>`);
  });
  (spec.notes || []).forEach((t) => {
    parts.push(`<g class="lyr" data-el="${t.id}"><text x="${t.x}" y="${sy + RH + 30 + (t.dy || 0)}" class="d-note" text-anchor="${t.anchor || "middle"}">${esc(t.t)}</text></g>`);
  });
  const h = sy + RH + 30 + 34 + (spec.extraH || 0);
  return { viewBox: `0 0 ${W} ${h}`, svg: parts.join("") };
}

// ---------------------------------------------------------------------------
// Act 1: one county, many towns (primary_county_id -> county_id)
// ---------------------------------------------------------------------------
const NAME_W = 150;
const CHIP_W = 56;
const counties1 = [
  ["Crook", 7, 1],
  ["Gilliam", 11, 2],
  ["Harney", 13, 3],
  ["Wahkiakum", 71, 4],
];
const towns1 = [
  ["Arlington", 2],
  ["Burns", 3],
  ["Condon", 2],
  ["Hines", 3],
  ["Lonerock", 2],
  ["Prineville", 1],
];
const idOf1 = { 1: 7, 2: 11, 3: 13, 4: 71 };

const oneMany = panel({
  lt: "pnw_counties",
  rt: "pnw_towns",
  lhdr: "county · county_id (PK)",
  rhdr: "primary_county_id (FK) · town",
  left: counties1.map(([name, id, key]) => [{ t: name, w: NAME_W }, { t: id, w: CHIP_W, key }]),
  right: towns1.map(([name, key]) => [{ t: idOf1[key], w: CHIP_W, key }, { t: name, w: NAME_W }]),
  links: towns1.map(([, key], j) => ({ id: `ln-${j}`, l: key - 1, r: j, key })),
  badges: [
    { id: "b-0", i: 0, t: "1" },
    { id: "b-1", i: 1, t: "3" },
    { id: "b-2", i: 2, t: "2" },
    { id: "b-3", i: 3, t: "0", bad: true },
  ],
  summary: [
    { x: 60, w: 206, t: "pnw_counties" },
    { x: 534, w: 206, t: "pnw_towns" },
  ],
  marks: [
    { id: "m-one", at: 0, out: 1, kind: "one" },
    { id: "m-many", at: 1, out: -1, kind: "zeroMany" },
  ],
  notes: [
    { id: "n-left", x: 163, t: "each town: exactly one county" },
    { id: "n-right", x: 637, t: "each county: zero or many towns" },
  ],
});

const ALL_LINES = towns1.map((_, j) => `ln-${j}`).join(",");

export const oneToManyAct = {
  id: "scrolly-cardinality-one-to-many",
  title: "Cardinality: one county, many towns",
  call: "pnw_towns.primary_county_id  →  pnw_counties.county_id",
  viewBox: oneMany.viewBox,
  svg: oneMany.svg,
  steps: [
    {
      beat: "Step 1 · the tables",
      show: "",
      html: "Four real counties and six real towns. Every town stores the <code>county_id</code> of its county in <code>primary_county_id</code>, the foreign key. The colored chips are the same numbers on both sides.",
    },
    {
      beat: "Step 2 · every town points once",
      show: ALL_LINES,
      html: "Draw a line from each town to the county its chip matches. Every town gets <b>exactly one</b> line: <code>primary_county_id</code> holds one value and is never <code>NULL</code> (0 of 453 towns).",
    },
    {
      beat: "Step 3 · mark the county end",
      show: `${ALL_LINES},sum,m-one,n-left`,
      html: "On an ERD, that fact goes at the <b>county</b> end of the line, because it answers \"how many counties does one town have?\" Two bars mean <b>exactly one</b>.",
    },
    {
      beat: "Step 4 · count lines per county",
      show: `${ALL_LINES},b-0,b-1,b-2,sum,m-one,n-left`,
      html: "Now look from the county side. Gilliam collects three lines, Harney two, Crook one. More than one is drawn as a <b>crow's foot</b>, the fan, at the <b>town</b> end.",
    },
    {
      beat: "Step 5 · a county with no towns",
      show: `${ALL_LINES},b-0,b-1,b-2,b-3,sum,m-one,n-left,m-many`,
      html: "Wahkiakum collects <b>zero</b> lines. It has towns in real life (its seat is Cathlamet), but none made it into <code>pnw_towns</code>, whose Washington rows are incomplete; San Juan is the same. So this zero comes from <b>incomplete data</b>. The <b>circle</b> beside the crow's foot still belongs: it says the database allows a county with no towns, whatever the reason. That end reads <b>zero or many</b>.",
    },
    {
      beat: "Step 6 · read the whole line",
      show: `${ALL_LINES},b-0,b-1,b-2,b-3,sum,m-one,m-many,n-left,n-right`,
      html: "Read each end as \"one row of the <i>other</i> table has this many of <i>me</i>.\" One town has exactly one county; one county has zero or many towns (0 to 34 across all 75 in this data). That is a <b>one-to-many</b> relationship, and the foreign key sits on the many side.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Act 2: zero or one at both ends (county_seat_town_id -> town_id)
// ---------------------------------------------------------------------------
const counties2 = [
  ["Crook", 172, 1],
  ["Gilliam", 38, 2],
  ["Harney", 24, 3],
  ["Wahkiakum", null, null],
];
const towns2 = [
  ["Arlington", 7, null],
  ["Burns", 24, 3],
  ["Condon", 38, 2],
  ["Hines", 93, null],
  ["Lonerock", 122, null],
  ["Prineville", 172, 1],
];

const seat = panel({
  lt: "pnw_counties",
  rt: "pnw_towns",
  lhdr: "county · county_seat_town_id (FK)",
  rhdr: "town_id (PK) · town",
  left: counties2.map(([name, id, key]) => [{ t: name, w: NAME_W }, id === null ? { w: CHIP_W + 8, null: true } : { t: id, w: CHIP_W + 8, key }]),
  right: towns2.map(([name, id, key]) => [key ? { t: id, w: CHIP_W + 8, key } : { t: id, w: CHIP_W + 8 }, { t: name, w: NAME_W }]),
  links: [
    { id: "s-0", l: 0, r: 5, key: 1 },
    { id: "s-1", l: 1, r: 2, key: 2 },
    { id: "s-2", l: 2, r: 1, key: 3 },
  ],
  badges: [
    { id: "c-3", i: 3, t: "0", bad: true },
    { id: "t-0", side: "R", i: 0, t: "0" },
    { id: "t-1", side: "R", i: 1, t: "1" },
    { id: "t-2", side: "R", i: 2, t: "1" },
    { id: "t-3", side: "R", i: 3, t: "0" },
    { id: "t-4", side: "R", i: 4, t: "0" },
    { id: "t-5", side: "R", i: 5, t: "1" },
  ],
  summary: [
    { x: 60, w: 214, t: "pnw_counties" },
    { x: 526, w: 214, t: "pnw_towns" },
  ],
  marks: [
    { id: "m-town", at: 1, out: -1, kind: "zeroOne" },
    { id: "m-county", at: 0, out: 1, kind: "zeroOne" },
  ],
  notes: [
    { id: "n2-right", x: 633, t: "each county: zero or one seat" },
    { id: "n2-left", x: 167, t: "each town: seat of zero or one" },
  ],
});
const SEAT_LINES = "s-0,s-1,s-2";
const TOWN_BADGES = "t-0,t-1,t-2,t-3,t-4,t-5";

export const zeroOrOneAct = {
  id: "scrolly-cardinality-zero-or-one",
  title: "Cardinality: zero or one, at both ends",
  call: "pnw_counties.county_seat_town_id  →  pnw_towns.town_id",
  viewBox: seat.viewBox,
  svg: seat.svg,
  steps: [
    {
      beat: "Step 1 · the other key",
      show: "",
      html: "The second line on the ERD runs the other way. Each county stores the <code>town_id</code> of its seat in <code>county_seat_town_id</code>. Wahkiakum's seat, Cathlamet, is not in <code>pnw_towns</code>, so its value is <code>NULL</code>.",
    },
    {
      beat: "Step 2 · counties point at their seat",
      show: SEAT_LINES,
      html: "Three counties draw one line each, to the town whose <code>town_id</code> matches. A single column can hold only one value, so no county can draw two.",
    },
    {
      beat: "Step 3 · the town end",
      show: `${SEAT_LINES},c-3,sum,m-town,n2-right`,
      html: "Wahkiakum draws <b>no</b> line, like 5 of the 75 counties. Every county has a seat in real life, so these are data gaps: four seats (Friday Harbor, Cathlamet, Waterville, Coupeville) are missing from <code>pnw_towns</code>, and Columbia County, Oregon lists \"Saint Helens\" where <code>pnw_towns</code> spells it \"St. Helens\", so the key was never filled in. Either way the database allows a county with <b>zero or one</b> seat town: a bar for \"at most one\", and a circle for \"maybe none\".",
    },
    {
      beat: "Step 4 · the county end",
      show: `${SEAT_LINES},c-3,${TOWN_BADGES},sum,m-town,n2-right`,
      html: "From the town side: Burns, Condon, and Prineville are each the seat of exactly one county; Arlington, Hines, and Lonerock of none. Across the whole table no town is the seat of two counties.",
    },
    {
      beat: "Step 5 · read the whole line",
      show: `${SEAT_LINES},c-3,${TOWN_BADGES},sum,m-town,m-county,n2-right,n2-left`,
      html: "Zero or one at <b>both</b> ends: an optional <b>one-to-one</b>. Compare the first diagram, where the foreign key sat on the many side; here it sits on the county side, and the circles warn that a JOIN on it can come back empty.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Act 3: many to many (towns that straddle counties)
// ---------------------------------------------------------------------------
const counties3 = [
  ["Benton", 2, 1],
  ["Clackamas", 3, 2],
  ["Linn", 22, 3],
  ["Marion", 24, 4],
  ["Multnomah", 26, 5],
  ["Washington", 34, 6],
];
const PS_W = 46;
const towns3 = [
  ["Albany", 3, 1, null],
  ["Gates", 4, 3, null],
  ["Idanha", 4, 3, null],
  ["Lake Oswego", 2, 5, 6],
];
const idOf3 = { 1: 2, 2: 3, 3: 22, 4: 24, 5: 26, 6: 34 };
const fkCell = (key) => (key ? { t: idOf3[key], w: PS_W, key } : { w: PS_W, null: true });

const linksP = towns3.map(([, p], j) => ({ id: `p-${j}`, l: p - 1, r: j, key: p }));
const linksS = towns3.flatMap(([, , s], j) => (s ? [{ id: `s3-${j}`, l: s - 1, r: j, key: s, dash: "14 9" }] : []));
const linksT = towns3.flatMap(([, , , t], j) => (t ? [{ id: `t3-${j}`, l: t - 1, r: j, key: t, dash: "3 9" }] : []));

const many = panel({
  lt: "pnw_counties",
  rt: "pnw_towns",
  lhdr: "county · county_id",
  rhdr: "primary · secondary · tertiary _county_id",
  left: counties3.map(([name, id, key]) => [{ t: name, w: 140 }, { t: id, w: 50, key }]),
  right: towns3.map(([name, p, s, t]) => [fkCell(p), fkCell(s), fkCell(t), { t: name, w: 140 }]),
  links: [...linksP, ...linksS, ...linksT],
  badges: [
    { id: "lin", i: 2, t: "3" },
    { id: "lo", side: "R", i: 3, t: "3" },
    { id: "alb", side: "R", i: 0, t: "2" },
  ],
  sumTitle: "an ERD draws many-to-many through a bridge table",
  summary: [
    { x: 40, w: 196, t: "pnw_counties" },
    { x: 302, w: 196, t: "town_county" },
    { x: 564, w: 196, t: "pnw_towns" },
  ],
  marks: [
    { id: "mm-1", at: 0, out: 1, kind: "one" },
    { id: "mm-2", at: 1, out: -1, kind: "zeroMany" },
    { id: "mm-3", at: 1, out: 1, kind: "oneMany" },
    { id: "mm-4", at: 2, out: -1, kind: "one" },
  ],
  notes: [
    { id: "n3", x: 400, t: "one row per line: 9 rows here, 475 for all 453 towns" },
    { id: "n3b", x: 400, dy: 24, t: "this database fakes it with three county columns instead" },
  ],
  extraH: 24,
});
const P_LINES = linksP.map((k) => k.id).join(",");
const EXTRA_LINES = [...linksS, ...linksT].map((k) => k.id).join(",");

export const manyToManyAct = {
  id: "scrolly-cardinality-many-to-many",
  title: "Cardinality: many to many, and the bridge table",
  call: "a town can lie in up to three counties; a county holds many towns",
  viewBox: many.viewBox,
  svg: many.svg,
  steps: [
    {
      beat: "Step 1 · towns that straddle",
      show: "",
      html: "20 towns sit in more than one county, so <code>pnw_towns</code> has three county keys: primary, secondary, and tertiary. Empty slots are <code>NULL</code>.",
    },
    {
      beat: "Step 2 · primary only",
      show: P_LINES,
      html: "Using <code>primary_county_id</code> alone gives the first diagram again: one solid line per town.",
    },
    {
      beat: "Step 3 · add the other keys",
      show: `${P_LINES},${EXTRA_LINES},alb,lo`,
      html: "Add the secondary (dashed) and tertiary (dotted) keys. Albany now has 2 counties and Lake Oswego 3. One town, <b>many</b> counties.",
    },
    {
      beat: "Step 4 · many on both sides",
      show: `${P_LINES},${EXTRA_LINES},alb,lo,lin`,
      html: "And one county still holds many towns: Linn collects Albany, Gates, and Idanha here (15 towns in all). Many at both ends is a <b>many-to-many</b> relationship.",
    },
    {
      beat: "Step 5 · the bridge table",
      show: `${P_LINES},${EXTRA_LINES},alb,lo,lin,sum,mm-1,mm-2,mm-3,mm-4,n3,n3b`,
      html: "No single column can hold \"many\". The standard design is a <b>bridge table</b> with one row per line (<code>town_id</code>, <code>county_id</code>), which turns many-to-many into two one-to-many lines. This database stores the pairs as three columns instead, which caps a town at three counties and makes a query check all three.",
    },
  ],
};
