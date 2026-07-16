#!/usr/bin/env node
/**
 * Regenerate the join-diagram PNGs used by the tutorial (INNER/LEFT/anti-join
 * panels) from code, in the established visual language: colored key chips,
 * thick outlined arrows for matches, dead-end circles for no-match rows,
 * faded rows for anything a join drops, dark-gradient cells for NULL.
 *
 * Writes both copies of each panel:
 *   ../../images/<name with spaces>.png      (referenced by examples.Rmd)
 *   ../public/images/<name-with-dashes>.png  (referenced by the MDX pages)
 *
 * Usage:  node site/scripts/gen_join_diagrams.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dirname, "..");
const REPO = resolve(SITE, "..");
const OUT_RMD = resolve(REPO, "images");
const OUT_SITE = resolve(SITE, "public", "images");

// Key colors, one per id value — identical to the originals.
const C = { 1: "#EFD46A", 2: "#6FB5DF", 3: "#C0562F", 4: "#B678A8", 5: "#F7E3C1", 6: "#A5E07E" };
// Darker strokes for the pale chips' dead-end markers.
const STROKE = { 5: "#D9A94E", 6: "#5FA83C" };

const RH = 56; // row height
const IDW = 84,
  VALW = 120;
const LX = 60,
  RX = 640;
const TY = 120;
const W = 980;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function table(x, y, title, rows, { ghost = [], titleAnchor = "start" } = {}) {
  const tx = titleAnchor === "start" ? x : x + IDW + VALW;
  const out = [
    `<text x="${tx}" y="${y - 56}" class="ttl" text-anchor="${titleAnchor}">${esc(title)}</text>`,
    `<text x="${x + IDW / 2}" y="${y - 16}" class="hdr" text-anchor="middle">id</text>`,
    `<text x="${x + IDW + VALW / 2}" y="${y - 16}" class="hdr" text-anchor="middle">val</text>`,
  ];
  rows.forEach(([id, val], ri) => {
    const ry = y + ri * RH;
    const op = ghost.includes(ri) ? ' opacity="0.22"' : "";
    out.push(
      `<g${op}><rect x="${x}" y="${ry}" width="${IDW}" height="${RH}" fill="${C[id]}" stroke="#111" stroke-width="3"/>` +
        `<text x="${x + IDW / 2}" y="${ry + RH / 2 + 8}" class="cell" text-anchor="middle">${id}</text>` +
        `<rect x="${x + IDW}" y="${ry}" width="${VALW}" height="${RH}" fill="#fff" stroke="#111" stroke-width="3"/>` +
        `<text x="${x + IDW + VALW / 2}" y="${ry + RH / 2 + 8}" class="cell" text-anchor="middle">${esc(val)}</text></g>`
    );
  });
  return out.join("\n");
}

const rowmid = (ri) => TY + ri * RH + RH / 2;

function arrow(x1, y1, x2, y2, color) {
  const dx = x2 - x1,
    dy = y2 - y1;
  const L = Math.hypot(dx, dy),
    ux = dx / L,
    uy = dy / L,
    px = -uy,
    py = ux;
  const hw = 16,
    hl = 28,
    bw = 7.5;
  const bx = x2 - hl * ux,
    by = y2 - hl * uy;
  const pts = [
    [x1 + bw * px, y1 + bw * py],
    [bx + bw * px, by + bw * py],
    [bx + hw * px, by + hw * py],
    [x2, y2],
    [bx - hw * px, by - hw * py],
    [bx - bw * px, by - bw * py],
    [x1 - bw * px, y1 - bw * py],
  ];
  const p = pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");
  return `<polygon points="${p}" fill="${color}" stroke="#111" stroke-width="3"/>`;
}

function deadend(x1, y1, id, ln = 70) {
  const color = STROKE[id] ?? C[id];
  const x2 = x1 + ln;
  return (
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y1}" stroke="${color}" stroke-width="8"/>` +
    `<circle cx="${x2 + 13}" cy="${y1}" r="13" fill="#fff" stroke="${color}" stroke-width="8"/>`
  );
}

function downarrow(cx, y) {
  return (
    `<polygon points="${cx - 26},${y} ${cx + 26},${y} ${cx + 26},${y + 48} ${cx + 58},${y + 48} ${cx},${y + 98} ${cx - 58},${y + 48} ${cx - 26},${y + 48}"` +
    ` fill="#fff" stroke="#111" stroke-width="4"/>`
  );
}

function resultTable(cy, title, cols, colw, rows) {
  const tw = colw.reduce((a, b) => a + b, 0);
  const x = (W - tw) / 2;
  const out = [`<text x="${W / 2}" y="${cy - 60}" class="ttl" text-anchor="middle">${esc(title)}</text>`];
  let cx = x;
  cols.forEach((cname, ci) => {
    out.push(`<text x="${cx + colw[ci] / 2}" y="${cy - 14}" class="hdr" text-anchor="middle">${esc(cname)}</text>`);
    cx += colw[ci];
  });
  rows.forEach((row, ri) => {
    const ry = cy + ri * RH;
    let cx2 = x;
    row.cells.forEach((cell, ci) => {
      if (cell === null) {
        out.push(
          `<rect x="${cx2}" y="${ry}" width="${colw[ci]}" height="${RH}" fill="url(#nullfill)" stroke="#111" stroke-width="3"/>`
        );
      } else {
        const fill = ci === 0 ? C[row.key] : "#fff";
        out.push(
          `<rect x="${cx2}" y="${ry}" width="${colw[ci]}" height="${RH}" fill="${fill}" stroke="#111" stroke-width="3"/>` +
            `<text x="${cx2 + colw[ci] / 2}" y="${ry + RH / 2 + 8}" class="cell" text-anchor="middle">${esc(cell)}</text>`
        );
      }
      cx2 += colw[ci];
    });
  });
  return { svg: out.join("\n"), bottom: cy + rows.length * RH };
}

const SVG_STYLE =
  `<style>` +
  `.ttl{font:700 44px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#111}` +
  `.hdr{font:500 30px -apple-system,'Segoe UI',Roboto,Helvetica,sans-serif;fill:#111}` +
  `.cell{font:500 38px -apple-system,'Segoe UI',Roboto,Helvetica,sans-serif;fill:#111}` +
  `</style>` +
  `<defs><linearGradient id="nullfill" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="#2f2f2f"/><stop offset="0.5" stop-color="#c9c9c9"/><stop offset="1" stop-color="#3a3a3a"/>` +
  `</linearGradient></defs>`;

const LEFT_ROWS = [
  [1, "L1"],
  [2, "L2"],
  [3, "L3"],
  [4, "L4"],
];
const RIGHT_ROWS = [
  [1, "R1"],
  [4, "R2"],
  [5, "R3"],
  [6, "R4"],
];
const RIGHT2_ROWS = [
  [1, "R1"],
  [1, "R2"],
  [4, "R3"],
  [5, "R4"],
  [6, "R5"],
];

const L_EDGE = LX + IDW + VALW;

function panel(spec) {
  const parts = [SVG_STYLE];
  parts.push(table(LX, TY, "left_table", LEFT_ROWS, { ghost: spec.ghostL ?? [] }));
  parts.push(
    table(RX, TY, spec.rightTitle ?? "right_table", spec.rightRows ?? RIGHT_ROWS, {
      ghost: spec.ghostR ?? [],
      titleAnchor: "end",
    })
  );
  for (const [li, ri] of spec.arrows ?? []) {
    parts.push(arrow(L_EDGE, rowmid(li), RX, rowmid(ri), C[LEFT_ROWS[li][0]]));
  }
  for (const li of spec.deadends ?? []) {
    parts.push(deadend(L_EDGE, rowmid(li), LEFT_ROWS[li][0]));
  }
  const nRight = (spec.rightRows ?? RIGHT_ROWS).length;
  const tblBottom = TY + Math.max(LEFT_ROWS.length, nRight) * RH;
  if (!spec.result) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${tblBottom + 40}">${parts.join("\n")}</svg>`;
  }
  parts.push(downarrow(W / 2, tblBottom + 40));
  const resY = tblBottom + 40 + 98 + 130;
  const { svg, bottom } = resultTable(resY, spec.result.title, spec.result.cols, spec.result.colw, spec.result.rows);
  parts.push(svg);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${bottom + 40}">${parts.join("\n")}</svg>`;
}

const COLS3 = ["L_id", "L_val", "R_val"];
const W3 = [IDW, VALW, VALW];

const PANELS = {
  "01a-INNER JOIN": panel({
    arrows: [
      [0, 0],
      [3, 1],
    ],
  }),
  "01b-INNER JOIN": panel({
    arrows: [
      [0, 0],
      [3, 1],
    ],
    ghostL: [1, 2],
    ghostR: [2, 3],
  }),
  "01c-INNER JOIN": panel({
    arrows: [
      [0, 0],
      [3, 1],
    ],
    ghostL: [1, 2],
    ghostR: [2, 3],
    result: {
      title: "INNER JOIN",
      cols: COLS3,
      colw: W3,
      rows: [
        { key: 1, cells: [1, "L1", "R1"] },
        { key: 4, cells: [4, "L4", "R2"] },
      ],
    },
  }),
  "02a-LEFT JOIN": panel({
    arrows: [
      [0, 0],
      [3, 1],
    ],
    deadends: [1, 2],
  }),
  "02b-LEFT JOIN": panel({
    arrows: [
      [0, 0],
      [3, 1],
    ],
    deadends: [1, 2],
    ghostR: [2, 3],
    result: {
      title: "LEFT JOIN",
      cols: COLS3,
      colw: W3,
      rows: [
        { key: 1, cells: [1, "L1", "R1"] },
        { key: 2, cells: [2, "L2", null] },
        { key: 3, cells: [3, "L3", null] },
        { key: 4, cells: [4, "L4", "R2"] },
      ],
    },
  }),
  "02c-LEFT JOIN multiple": panel({
    rightTitle: "right2",
    rightRows: RIGHT2_ROWS,
    arrows: [
      [0, 0],
      [0, 1],
      [3, 2],
    ],
    deadends: [1, 2],
    result: {
      title: "LEFT JOIN",
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
  }),
  "12-Anti join": panel({
    ghostL: [0, 3],
    ghostR: [0, 1, 2, 3],
    deadends: [1, 2],
    result: {
      title: "Anti-join",
      cols: ["L_id", "L_val"],
      colw: [IDW, VALW],
      rows: [
        { key: 2, cells: [2, "L2"] },
        { key: 3, cells: [3, "L3"] },
      ],
    },
  }),
};

async function main() {
  mkdirSync(OUT_RMD, { recursive: true });
  mkdirSync(OUT_SITE, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  for (const [name, svg] of Object.entries(PANELS)) {
    await page.setContent(
      `<!doctype html><html><body style="margin:0;background:#fff"><div id="fig" style="width:${W}px">${svg.replace(
        "<svg ",
        '<svg style="display:block;width:100%;height:auto" '
      )}</div></body></html>`
    );
    const el = page.locator("#fig");
    const rmdPath = resolve(OUT_RMD, `${name}.png`);
    const sitePath = resolve(OUT_SITE, `${name.replace(/ /g, "-")}.png`);
    await el.screenshot({ path: rmdPath });
    await el.screenshot({ path: sitePath });
    console.log(`✓ ${name}.png  (+ site copy ${name.replace(/ /g, "-")}.png)`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
