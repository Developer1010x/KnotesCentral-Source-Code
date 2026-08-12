export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const DARK_CLASS = "dark";
export const DEFAULT_THEME: Theme = "dark";

/** Reads the stored choice, else the OS preference. Browser only. */
export function readTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return DEFAULT_THEME;
  }
}

/** Applies the theme to <html> and persists it. */
export function applyTheme(theme: Theme, persist = true) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle(DARK_CLASS, theme === "dark");
  if (!persist) return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
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
