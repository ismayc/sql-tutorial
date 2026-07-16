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
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from "@codemirror/autocomplete";
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
const TutorialSQLite = SQLDialect.define({
  ...SQLite.spec,
  keywords: (SQLite.spec.keywords ?? "")
    .split(/\s+/)
    .filter((k) => k && !DEMOTED_KEYWORDS.has(k))
    .join(" "),
});

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
        autocompletion({ activateOnTyping: true, defaultKeymap: false }),
        EditorView.lineWrapping,
        themeComp.of(dark ? [oneDark] : []),
        keymap.of([
          ...closeBracketsKeymap,
          ...completionKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
          {
            key: "Mod-Enter",
            run: () => {
              onSubmit?.();
              return true;
            },
          },
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
