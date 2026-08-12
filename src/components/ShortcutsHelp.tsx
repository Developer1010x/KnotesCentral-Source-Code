"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/icons";

const SHORTCUTS: Array<{ keys: string[]; action: string }> = [
  { keys: ["⌘", "K"], action: "Search subjects, notes and pages" },
  { keys: ["Ctrl", "K"], action: "Same, on Windows and Linux" },
  { keys: ["/"], action: "Open search" },
  { keys: ["G", "H"], action: "Go home" },
  { keys: ["G", "S"], action: "Go to saved" },
  { keys: ["G", "N"], action: "Go to what's new" },
  { keys: ["G", "C"], action: "Go to contribute" },
  { keys: ["?"], action: "Show this list" },
  { keys: ["Esc"], action: "Close whatever is open" },
];

export function ShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-card border border-line bg-surface shadow-lift animate-fade-up">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-sm font-semibold text-fg">Keyboard shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:bg-raised hover:text-fg"
            aria-label="Close"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <ul className="divide-y divide-line">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.action}
              className="flex items-center justify-between gap-4 px-5 py-2.5 text-sm"
            >
              <span className="text-muted">{shortcut.action}</span>
              <span className="flex shrink-0 gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[11px] text-fg"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
