const KEY_PREFIX = "sqlt:";

export interface SavedExercise {
  code: string;
  completed: boolean;
  updatedAt: number;
}

function key(id: string): string {
  return `${KEY_PREFIX}${id}`;
}

export function getProgress(id: string): SavedExercise | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(id));
    if (!raw) return null;
    return JSON.parse(raw) as SavedExercise;
  } catch {
    return null;
  }
}

export function setProgress(id: string, partial: Partial<SavedExercise> & { code: string }): void {
  if (typeof localStorage === "undefined") return;
  const existing = getProgress(id);
  const next: SavedExercise = {
    code: partial.code,
    completed: partial.completed ?? existing?.completed ?? false,
    updatedAt: Date.now(),
  };
  try {
    localStorage.setItem(key(id), JSON.stringify(next));
  } catch {
    /* storage quota / private mode — ignore */
  }
}

export function clearProgress(id: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(key(id));
  } catch {
    /* ignore */
  }
}
