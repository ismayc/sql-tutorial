#!/usr/bin/env python3
"""Convert R Markdown learnr tutorials into MDX pages using SqlExercise + Hint.

Reads:
  ../../examples.Rmd
  ../../exercises/exercises.Rmd

Writes:
  ../src/pages/examples/<slug>.mdx
  ../src/pages/exercises/<slug>.mdx
"""
from __future__ import annotations
import re
import subprocess
import sys
from pathlib import Path
from typing import Optional

HERE = Path(__file__).resolve().parent
SITE = HERE.parent
REPO = SITE.parent
PAGES = SITE / "src" / "pages"


# ---------- helpers ----------

def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9\s\-]+", "", s)
    s = re.sub(r"[\s_\-]+", "-", s).strip("-")
    return s or "section"


def parse_chunk_meta(meta: str) -> dict:
    """Parse `sql query1, exercise=TRUE, exercise.eval=FALSE` → dict."""
    out: dict = {}
    parts = [p.strip() for p in meta.split(",") if p.strip()]
    if parts and "=" not in parts[0]:
        out["name"] = parts[0]
        parts = parts[1:]
    for p in parts:
        if "=" in p:
            k, _, v = p.partition("=")
            out[k.strip()] = v.strip().strip("'\"")
    return out


CHUNK_RE = re.compile(r"^```\{(?P<lang>[\w]+)\s*(?P<rest>[^}]*)\}\s*$")
SECTION_H1 = re.compile(r"^# (?!#)(?P<title>.+)$")
HTML_OPEN_RE = re.compile(r"^\s*<(style|details|script)\b", re.IGNORECASE)


def tokenize(text: str):
    """Stream tokens: ('chunk', lang, meta, body) | ('line', str)."""
    lines = text.splitlines()
    i = 0
    in_html_tag: Optional[str] = None
    in_comment = False
    while i < len(lines):
        line = lines[i]

        if in_comment:
            if "-->" in line:
                in_comment = False
            i += 1
            continue
        if "<!--" in line:
            j = line.find("<!--")
            if "-->" in line[j + 4:]:
                line = re.sub(r"<!--.*?-->", "", line)
                if not line.strip():
                    i += 1
                    continue
            else:
                in_comment = True
                i += 1
                continue

        if in_html_tag is not None:
            if re.search(rf"</{in_html_tag}>", line, re.IGNORECASE):
                in_html_tag = None
            i += 1
            continue
        m = HTML_OPEN_RE.match(line)
        if m:
            tag = m.group(1).lower()
            if re.search(rf"</{tag}>", line, re.IGNORECASE):
                i += 1
                continue
            in_html_tag = tag
            i += 1
            continue

        m = CHUNK_RE.match(line)
        if m:
            lang = m.group("lang")
            meta = parse_chunk_meta(m.group("rest").lstrip(", "))
            body_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                body_lines.append(lines[i])
                i += 1
            i += 1  # consume closing fence
            yield ("chunk", lang, meta, "\n".join(body_lines))
            continue

        yield ("line", line)
        i += 1


# ---------- structure ----------

class Exercise:
    __slots__ = ("base", "starter", "solution", "hints")
    def __init__(self, base: str):
        self.base: str = base
        self.starter: Optional[str] = None
        self.solution: Optional[str] = None
        self.hints: list[tuple[int, str]] = []


HINT_RE = re.compile(r"^(?P<base>.+?)-hint-(?P<n>\d+)$")
SOLUTION_RE = re.compile(r"^(?P<base>.+?)-solution$")
CHECK_RE = re.compile(r"^(?P<base>.+?)-check$")


def split_sections(tokens):
    """Group tokens by top-level `# Section`. Drops any preamble."""
    sections: list[tuple[str, list]] = []
    current: Optional[tuple[str, list]] = None
    for tok in tokens:
        if tok[0] == "line":
            m = SECTION_H1.match(tok[1])
            if m:
                current = (m.group("title").strip(), [])
                sections.append(current)
                continue
        if current is not None:
            current[1].append(tok)
    return sections


def group_exercises(tokens):
    """Replace exercise starter chunks with ('exercise', Exercise), drop hint/solution/check."""
    exercises: dict[str, Exercise] = {}
    for tok in tokens:
        if tok[0] != "chunk":
            continue
        _, lang, meta, body = tok
        name = meta.get("name", "")
        if not name:
            continue
        if lang == "sql" and meta.get("exercise") == "TRUE":
            ex = exercises.setdefault(name, Exercise(name))
            ex.starter = body
        elif lang == "sql":
            m = HINT_RE.match(name)
            if m:
                base = m.group("base")
                ex = exercises.setdefault(base, Exercise(base))
                ex.hints.append((int(m.group("n")), body))
                continue
            m = SOLUTION_RE.match(name)
            if m:
                base = m.group("base")
                ex = exercises.setdefault(base, Exercise(base))
                # Skip intentionally-broken solutions (chunks with error=TRUE),
                # which the original learnr tutorial uses as teaching examples.
                if meta.get("error") == "TRUE":
                    continue
                ex.solution = body

    out = []
    emitted: set[str] = set()
    for tok in tokens:
        if tok[0] != "chunk":
            out.append(tok)
            continue
        _, lang, meta, body = tok
        name = meta.get("name", "")
        if lang == "sql" and meta.get("exercise") == "TRUE":
            ex = exercises.get(name)
            if ex and name not in emitted:
                out.append(("exercise", ex))
                emitted.add(name)
            continue
        if name and (HINT_RE.match(name) or SOLUTION_RE.match(name) or CHECK_RE.match(name)):
            continue
        # Other named/unnamed chunks: skip R setup, preserve plain SQL display chunks
        if lang == "r":
            continue
        if lang == "sql":
            # Display-only SQL (no exercise= flag) — preserve as a fenced code block
            out.append(("rawcode", lang, meta, body))
    return out


# ---------- rendering ----------

def escape_template_literal(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def render_exercise(ex: Exercise, db: str) -> str:
    starter = (ex.starter or "-- Write your SQL query here\n").rstrip() + "\n"
    solution = (ex.solution or "").rstrip()
    requires_ordering = bool(solution) and re.search(r"\bORDER\s+BY\b", solution, re.IGNORECASE) is not None

    props: list[str] = [f'id="{ex.base}"', f'db="{db}"']
    default_starter = "-- Write your SQL query here"
    if starter.strip() and starter.strip() != default_starter:
        props.append("initial={`" + escape_template_literal(starter) + "`}")
    if solution:
        props.append("solution={`" + escape_template_literal(solution) + "`}")
    else:
        props.append('solution=""')
    if requires_ordering:
        props.append("requireOrdering")

    open_tag = "<SqlExercise\n  " + "\n  ".join(props)
    if not ex.hints:
        return open_tag + "\n/>"

    hint_blocks = []
    for n, body in sorted(ex.hints, key=lambda h: h[0]):
        body = body.strip()
        hint_blocks.append(
            f'  <Hint label="Hint {n}">\n\n```sql\n{body}\n```\n\n  </Hint>'
        )
    hints_inner = "\n".join(hint_blocks)
    return (
        open_tag + "\n>\n"
        f'  <Fragment slot="hints">\n'
        f"{hints_inner}\n"
        f"  </Fragment>\n"
        f"</SqlExercise>"
    )


IMAGE_RE = re.compile(r"!\[([^\]]*)\]\((?:images|www)/([^)]+?)\)(\{[^}]*\})?")
SIZED_IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+?)\)\{[^}]*\}")
H4_DECORATIVE_RE = re.compile(r"^####\s")


def transform_line(line: str) -> str:
    # Image paths: images/X.png or www/X.png → /sql-tutorial/images/X.png
    # Also slugify filename spaces (since we renamed the assets on disk).
    line = IMAGE_RE.sub(
        lambda m: f"![{m.group(1)}](/sql-tutorial/images/{m.group(2).replace(' ', '-')})",
        line,
    )
    # Strip image size attributes
    line = SIZED_IMAGE_RE.sub(r"![\1](\2)", line)
    return line


def render_section(title: str, tokens, db: str) -> str:
    grouped = group_exercises(tokens)
    out: list[str] = [
        "---",
        "layout: ../../layouts/BaseLayout.astro",
        f"title: {title}",
        "---",
        'import SqlExercise from "../../components/SqlExercise.astro";',
        'import Hint from "../../components/Hint.astro";',
        'import SchemaReference from "../../components/SchemaReference.astro";',
        "",
        f"# {title}",
        "",
        f'<SchemaReference db="{db}" />',
        "",
    ]
    prev_kind = None
    for tok in grouped:
        kind = tok[0]
        if kind == "line":
            out.append(transform_line(tok[1]))
        elif kind == "exercise":
            if prev_kind != "blank":
                out.append("")
            out.append(render_exercise(tok[1], db))
            out.append("")
            kind = "blank"
        elif kind == "rawcode":
            _, lang, _, body = tok
            out.append("")
            out.append(f"```{lang}")
            out.append(body)
            out.append("```")
            out.append("")
            kind = "blank"
        prev_kind = kind
    # Collapse 3+ blank lines into 2
    text = "\n".join(out).rstrip() + "\n"
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


# ---------- driver ----------

def collect_exercise_ids(tokens) -> list[str]:
    """Return the exercise IDs that will be rendered for this section, in source order."""
    grouped = group_exercises(tokens)
    return [tok[1].base for tok in grouped if tok[0] == "exercise"]


def collect_exercise_specs(tokens, db: str) -> list[dict]:
    """For each exercise, return {id, title, solution, db, requireOrdering, hasSolution}."""
    grouped = group_exercises(tokens)
    specs: list[dict] = []
    # Build a map of preceding heading text per exercise (best-effort)
    last_heading = ""
    for tok in grouped:
        if tok[0] == "line":
            line = tok[1]
            m = re.match(r"^#{3,4}\s+(.+)$", line)
            if m:
                last_heading = m.group(1).strip()
                continue
            m = re.match(r"^(?:\s*)(\d+)\.\s+(.+)$", line)
            if m and last_heading == "":
                last_heading = m.group(2).strip()
        elif tok[0] == "exercise":
            ex = tok[1]
            solution = (ex.solution or "").rstrip()
            requires_ordering = bool(solution) and re.search(r"\bORDER\s+BY\b", solution, re.IGNORECASE) is not None
            specs.append({
                "id": ex.base,
                "title": last_heading or ex.base,
                "solution": solution,
                "db": db,
                "requireOrdering": requires_ordering,
                "hasSolution": bool(solution),
            })
            last_heading = ""  # consume
    return specs


def process(rmd_path: Path, out_dir: Path, db: str) -> list[dict]:
    text = rmd_path.read_text()
    tokens = list(tokenize(text))
    sections = split_sections(tokens)

    # Wipe any existing .mdx (regenerated each run)
    out_dir.mkdir(parents=True, exist_ok=True)
    for p in out_dir.glob("*.mdx"):
        p.unlink()

    index: list[dict] = []
    for title, toks in sections:
        slug = slugify(title)
        candidate = slug
        n = 2
        while any(s["slug"] == candidate for s in index):
            candidate = f"{slug}-{n}"
            n += 1
        slug = candidate
        body = render_section(title, toks, db)
        (out_dir / f"{slug}.mdx").write_text(body)
        exercise_ids = collect_exercise_ids(toks)
        # Only count exercises with a check-able solution as part of completion
        checkable_ids = [eid for eid in exercise_ids if _exercise_has_solution(toks, eid)]
        specs = collect_exercise_specs(toks, db)
        index.append({
            "slug": slug,
            "title": title,
            "exerciseIds": exercise_ids,
            "checkableIds": checkable_ids,
            "exerciseCount": len(exercise_ids),
            "exercises": specs,
        })
    return index


def _exercise_has_solution(tokens, base: str) -> bool:
    for tok in tokens:
        if tok[0] != "chunk":
            continue
        _, lang, meta, _body = tok
        if lang == "sql" and meta.get("name") == f"{base}-solution":
            return True
    return False


def main() -> int:
    print(f"Site root: {SITE}")
    examples_idx = process(
        REPO / "examples.Rmd",
        PAGES / "examples",
        "pnw_database.sqlite",
    )
    for s in examples_idx:
        print(f"  examples/{s['slug']}.mdx — {s['title']} ({s['exerciseCount']} ex)")

    exercises_idx = process(
        REPO / "exercises" / "exercises.Rmd",
        PAGES / "exercises",
        "pnw_flights_database.sqlite",
    )
    for s in exercises_idx:
        print(f"  exercises/{s['slug']}.mdx — {s['title']} ({s['exerciseCount']} ex)")

    manifest = SITE / "src" / "generated-toc.json"
    import json
    manifest.write_text(
        json.dumps(
            {"examples": examples_idx, "exercises": exercises_idx},
            indent=2,
        )
        + "\n"
    )
    print(f"\nWrote TOC manifest: {manifest.relative_to(SITE)}")

    # ---------- dump per-DB schemas to a static JSON for autocomplete + schema reference ----------
    schemas: dict[str, dict[str, list[str]]] = {}
    for db_name in ("pnw_database.sqlite", "pnw_flights_database.sqlite"):
        db_path = SITE / "public" / "data" / db_name
        if not db_path.exists():
            print(f"  ! skipping schema for missing {db_name}")
            continue
        schemas[db_name] = dump_sqlite_schema(db_path)
    schemas_path = SITE / "src" / "generated-schemas.json"
    schemas_path.write_text(json.dumps(schemas, indent=2) + "\n")
    print(f"Wrote schema dump:  {schemas_path.relative_to(SITE)}")
    return 0


def dump_sqlite_schema(db_path: Path) -> dict[str, list[str]]:
    """Shell out to sqlite3 to dump {table: [columns...]} for one DB file."""
    out = subprocess.run(
        ["sqlite3", str(db_path), "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"],
        capture_output=True, text=True, check=True,
    ).stdout
    tables = [t for t in out.strip().splitlines() if t.strip()]
    schema: dict[str, list[str]] = {}
    for t in tables:
        safe = t.replace('"', '""')
        info = subprocess.run(
            ["sqlite3", str(db_path), f'PRAGMA table_info("{safe}");'],
            capture_output=True, text=True, check=True,
        ).stdout
        cols = []
        for line in info.strip().splitlines():
            # cid|name|type|notnull|dflt|pk
            parts = line.split("|")
            if len(parts) >= 2:
                cols.append(parts[1])
        schema[t] = cols
    return schema


if __name__ == "__main__":
    sys.exit(main())
