export type Theme = "light" | "dark";
/** What the reader chose. "system" keeps following the OS setting. */
export type ThemeChoice = Theme | "system";

export const THEME_STORAGE_KEY = "theme";
export const DARK_CLASS = "dark";
export const DEFAULT_THEME: Theme = "dark";

export function systemTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** The stored choice, or "system" when nothing was ever chosen. */
export function readChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/** Reads the stored choice, else the OS preference. Browser only. */
export function readTheme(): Theme {
  const choice = readChoice();
  return choice === "system" ? systemTheme() : choice;
}

/** Applies a choice to <html> and persists it. "system" clears the override. */
export function applyTheme(choice: ThemeChoice, persist = true) {
  if (typeof document === "undefined") return;

  const resolved = choice === "system" ? systemTheme() : choice;
  document.documentElement.classList.toggle(DARK_CLASS, resolved === "dark");
  if (!persist) return;

  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage blocked (private mode, disabled cookies) — theme is still applied
    // for this page view, it just will not survive a reload.
  }
}

/**
 * Runs before hydration so the first paint already has the right theme.
 * Mirrors readTheme()/applyTheme() above; keep the three constants in sync.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle(${JSON.stringify(
      DARK_CLASS
    )}, theme === "dark");
  } catch (e) {
    document.documentElement.classList.add(${JSON.stringify(DARK_CLASS)});
  }
})();
`;
