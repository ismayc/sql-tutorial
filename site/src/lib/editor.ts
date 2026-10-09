import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { sql, SQLite, SQLDialect } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  indentOnInput,
} from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap, acceptCompletion } from "@codemirror/autocomplete";
import type { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import schemas from "../generated-schemas.json";

export interface CreateEditorOpts {
  parent: HTMLElement;
  initialValue?: string;
  dbFile?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}

function schemaForDb(dbFile?: string): Record<string, string[]> | undefined {
  if (!dbFile) return undefined;
  return (schemas as Record<string, Record<string, string[]>>)[dbFile];
}

// The ANSI SQL standard reserves several words (SQLSTATE machinery, datetime
// fields) that are plain column names in our teaching databases — `state` in
// counties, `year`/`month`/`day`/`hour`/`minute` in flights, `temp` in weather.
// lang-sql inherits them into the SQLite dialect and highlights them as
// keywords, which confuses students. Demote them to ordinary identifiers;
// SQLite itself does not reserve any of these.
const DEMOTED_KEYWORDS = new Set(["state", "year", "month", "day", "hour", "minute", "temp"]);
// The other way round: COUNT is highlighted only because ANSI reserves it, so
// SUM, AVG, MIN, MAX, and the other SQLite functions read as plain names next
// to it. Promote them so every function in the lessons looks the same. None
// is a table or column name in generated-schemas.json.
const PROMOTED_FUNCTIONS = [
  "sum", "avg", "min", "max", "total", "round", "abs", "length", "upper", "lower",
  "substr", "substring", "trim", "ltrim", "rtrim", "instr", "ifnull", "coalesce",
  "nullif", "group_concat", "printf", "strftime", "julianday", "random", "iif",
];
const TutorialSQLite = SQLDialect.define({
  ...SQLite.spec,
  keywords: [
    ...(SQLite.spec.keywords ?? "").split(/\s+/).filter((k) => k && !DEMOTED_KEYWORDS.has(k)),
    ...PROMOTED_FUNCTIONS,
  ].join(" "),
});

// lang-sql's schema completion offers column names only after "table." (or
// for one default table), so typing `SELECT po` never suggested
// population_2020_census. Offer every column in the page's database as a bare
// name too, with its table(s) as the detail, and rank columns of tables
// already named in the query first. Qualified "table." completion is left to
// lang-sql.
function columnCompletions(schema: Record<string, string[]>) {
  const tablesByColumn = new Map<string, string[]>();
  for (const [table, cols] of Object.entries(schema)) {
    for (const col of cols) tablesByColumn.set(col, [...(tablesByColumn.get(col) ?? []), table]);
  }
  return (ctx: CompletionContext): CompletionResult | null => {
    const word = ctx.matchBefore(/[A-Za-z_][A-Za-z0-9_]*/);
    if (!word || (word.from === word.to && !ctx.explicit)) return null;
    if (ctx.state.sliceDoc(word.from - 1, word.from) === ".") return null;
    const doc = ctx.state.doc.toString().toLowerCase();
    const options: Completion[] = [...tablesByColumn].map(([col, tables]) => ({
      label: col,
      type: "property",
      detail: tables.join(", "),
      boost: tables.some((t) => new RegExp(`\\b${t.toLowerCase()}\\b`).test(doc)) ? 2 : 1,
    }));
    return { from: word.from, options, validFor: /^[A-Za-z0-9_]*$/ };
  };
}

export interface EditorHandle {
  view: EditorView;
  getValue: () => string;
  setValue: (v: string) => void;
  destroy: () => void;
}

const themeComp = new Compartment();
const allEditors = new Set<{ view: EditorView }>();

function currentDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

export function createEditor({ parent, initialValue = "", dbFile, onChange, onSubmit }: CreateEditorOpts): EditorHandle {
  const dark = currentDark();
  const schema = schemaForDb(dbFile);
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: initialValue,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        sql({
          dialect: TutorialSQLite,
          upperCaseKeywords: true,
          ...(schema ? { schema } : {}),
        }),
        ...(schema ? [TutorialSQLite.language.data.of({ autocomplete: columnCompletions(schema) })] : []),
        autocompletion({ activateOnTyping: true, defaultKeymap: false }),
        EditorView.lineWrapping,
        themeComp.of(dark ? [oneDark] : []),
        keymap.of([
          // First: the first binding that matches a key wins, and CodeMirror's
          // defaultKeymap binds Mod-Enter to insertBlankLine.
          {
            key: "Mod-Enter",
            run: () => {
              onSubmit?.();
              return true;
            },
          },
          // Tab accepts an open suggestion (completionKeymap binds only
          // Enter); with no suggestion open it falls through to indentWithTab.
          { key: "Tab", run: acceptCompletion },
          ...closeBracketsKeymap,
          ...completionKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged && onChange) onChange(u.state.doc.toString());
        }),
      ],
    }),
  });

  const handle: EditorHandle = {
    view,
    getValue: () => view.state.doc.toString(),
    setValue: (v: string) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: v },
      });
    },
    destroy: () => {
      allEditors.delete(handle as { view: EditorView });
      view.destroy();
    },
  };
  allEditors.add(handle as { view: EditorView });
  return handle;
}

function applyThemeToAllEditors(dark: boolean) {
  for (const { view } of allEditors) {
    view.dispatch({
      effects: themeComp.reconfigure(dark ? [oneDark] : []),
    });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("sqlt:theme-changed", (e) => {
    const detail = (e as CustomEvent<{ dark: boolean }>).detail;
    applyThemeToAllEditors(detail.dark);
  });
}
