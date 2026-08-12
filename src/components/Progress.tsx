"use client";

import { Icon } from "@/components/ui/icons";
import { useDone } from "@/lib/prefs";

/** Tick a subject off. Purely local — nothing leaves the device. */
export function DoneToggle({
  path,
  label = "Mark as revised",
}: {
  path: string;
  label?: string;
}) {
  const { has, toggle, hydrated } = useDone();
  const done = hydrated && has(path);

  return (
    <button
      type="button"
      onClick={() => toggle(path)}
      aria-pressed={done}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
        done
          ? "border-lab/30 bg-lab/10 text-lab"
          : "border-line bg-surface text-fg hover:border-brand/40 hover:text-brand"
      }`}
    >
      <Icon name={done ? "checkCircle" : "check"} className="h-4 w-4" />
      {done ? "Revised" : label}
    </button>
  );
}

/** How much of a semester the reader has ticked off. */
export function SemesterProgress({ paths }: { paths: string[] }) {
  const { done, hydrated } = useDone();
  if (!hydrated || !paths.length) return null;

  const completed = paths.filter((path) => done.includes(path)).length;
  if (!completed) return null;

  const pct = Math.round((completed / paths.length) * 100);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-fg">Your revision progress</span>
        <span className="tabular-nums text-muted">
          {completed}/{paths.length} subjects
        </span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-raised"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Subjects revised"
      >
        <div
          className="h-full rounded-full bg-lab transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Small tick shown on subject cards that are already done. */
export function DoneBadge({ path }: { path: string }) {
  const { has, hydrated } = useDone();
  if (!hydrated || !has(path)) return null;

  return (
    <span
      title="Marked as revised"
      className="inline-flex items-center gap-1 text-xs font-medium text-lab"
    >
      <Icon name="checkCircle" className="h-3.5 w-3.5" />
      Revised
    </span>
  );
}
