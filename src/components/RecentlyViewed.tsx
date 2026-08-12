"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { pushRecent, readRecent, type RecentEntry } from "@/lib/recent";
import { Icon } from "@/components/ui/icons";

/** Records the current page so juniors can pick up where they left off. */
export function TrackVisit(entry: RecentEntry) {
  useEffect(() => {
    pushRecent(entry);
  }, [entry.path, entry.title, entry.subtitle]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function RecentlyViewed() {
  const [recent, setRecent] = useState<RecentEntry[]>([]);

  // Read after mount: localStorage does not exist during prerender.
  useEffect(() => setRecent(readRecent()), []);

  if (!recent.length) return null;

  return (
    <section aria-labelledby="recent-heading">
      <div className="mb-3 flex items-center gap-2">
        <Icon name="clock" className="h-4 w-4 text-muted" />
        <h2
          id="recent-heading"
          className="text-xs font-semibold uppercase tracking-widest text-muted"
        >
          Jump back in
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {recent.map((entry) => (
          <Link
            key={entry.path}
            href={entry.path}
            className="group rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-fg transition hover:border-brand/40 hover:text-brand"
          >
            {entry.title}
            <span className="ml-1.5 text-xs text-muted">{entry.subtitle}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
