const PREFIX = "eduplatform:";

export function storageKey(key: string): string {
  return `${PREFIX}${key}`;
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    // LocalStorage unavailable (private mode / blocked) — demo degrades
    // gracefully to in-memory-only state for this session.
  }
}

export function clearAllDemoStorage(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
