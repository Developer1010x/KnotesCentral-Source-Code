"use client";
import { useTheme } from "./ThemeProvider";
import { Icon } from "@/components/ui/icons";

const LABEL = {
  light: "Light theme",
  dark: "Dark theme",
  system: "Following your device",
} as const;

export function ThemeToggle() {
  const { theme, choice, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg p-2 text-muted transition hover:bg-raised hover:text-fg"
      aria-label={`${LABEL[choice]} — click to change`}
      title={`${LABEL[choice]} — click to change`}
    >
      <Icon
        name={
          choice === "system" ? "target" : theme === "dark" ? "sun" : "moon"
        }
        className="h-5 w-5"
      />
    </button>
  );
}
