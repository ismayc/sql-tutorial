const STORAGE_KEY = "sqlt:theme";

export type Theme = "light" | "dark" | "system";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredTheme(): Theme {
  if (typeof localStorage === "undefined") return "system";
  const t = localStorage.getItem(STORAGE_KEY);
  if (t === "light" || t === "dark" || t === "system") return t;
  return "system";
}

export function resolvedDark(theme: Theme): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return systemPrefersDark();
}

export function applyTheme(theme: Theme): void {
  const dark = resolvedDark(theme);
  document.documentElement.classList.toggle("dark", dark);
  window.dispatchEvent(new CustomEvent("sqlt:theme-changed", { detail: { dark } }));
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  applyTheme(theme);
}

export function nextTheme(current: Theme): Theme {
  if (current === "light") return "dark";
  if (current === "dark") return "system";
  return "light";
}

export function initTheme(): void {
  applyTheme(getStoredTheme());
  if (typeof window === "undefined") return;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    if (getStoredTheme() === "system") applyTheme("system");
  });
}
