"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  DEFAULT_THEME,
  readChoice,
  readTheme,
  systemTheme,
  type Theme,
  type ThemeChoice,
} from "@/lib/theme";

const ORDER: ThemeChoice[] = ["light", "dark", "system"];

const ThemeContext = createContext<{
  /** What is actually on screen right now. */
  theme: Theme;
  /** What the reader picked — "system" means follow the OS. */
  choice: ThemeChoice;
  /** Cycles light → dark → system. */
  toggleTheme: () => void;
}>({
  theme: DEFAULT_THEME,
  choice: "system",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [choice, setChoice] = useState<ThemeChoice>("system");

  // The inline script in the layout already set the class; this only syncs
  // React state with what the document is actually showing.
  useEffect(() => {
    setTheme(readTheme());
    setChoice(readChoice());
  }, []);

  // While on "system", keep following the OS if it flips (night mode etc).
  useEffect(() => {
    if (choice !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const next = systemTheme();
      setTheme(next);
      applyTheme("system", false);
    };

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [choice]);

  const toggleTheme = useCallback(() => {
    setChoice((current) => {
      const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
      applyTheme(next);
      setTheme(next === "system" ? systemTheme() : next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, choice, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
