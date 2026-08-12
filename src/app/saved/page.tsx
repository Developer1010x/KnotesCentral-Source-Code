"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useBookmarks, useDone } from "@/lib/prefs";

/**
 * The reader's own shelf. Everything here comes from localStorage, so it is
 * per-device and never leaves it — which is also why this page is client-only.
 */
export default function SavedPage() {
  const { bookmarks, toggle, hydrated } = useBookmarks();
  const { done, toggle: toggleDone, hydrated: doneReady } = useDone();

  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
          On this device
        </p>
        <h1 className="mt-1 text-display-sm font-bold text-fg">Saved</h1>
        <p className="mt-3 max-w-prose text-[0.975rem] leading-7 text-muted">
          Notes you starred and subjects you have ticked off. Stored on this
          device only — no account, nothing uploaded.
        </p>
      </header>

      <section aria-labelledby="saved-notes">
        <h2 id="saved-notes" className="text-base font-semibold text-fg">
          Saved notes{" "}
          {hydrated && bookmarks.length > 0 && (
            <span className="text-muted">({bookmarks.length})</span>
          )}
        </h2>

        {!hydrated ? (
          <div className="mt-3 space-y-2">
            <div className="skeleton h-16 w-full" />
            <div className="skeleton h-16 w-full" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="card mt-3 p-6 text-center">
            <p className="text-sm text-muted">
              Nothing saved yet. Tap the bookmark icon next to any note and it
              will show up here.
            </p>
            <Link
              href="/search"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast hover:opacity-90"
            >
              <Icon name="search" className="h-4 w-4" />
              Find something to save
            </Link>
          </div>
        ) : (
          <ul className="card mt-3 divide-y divide-line p-2">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.link}
                className="flex items-start gap-3 rounded-lg p-3 hover:bg-raised"
              >
                <a
                  href={bookmark.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group min-w-0 flex-1"
                >
                  <span className="block text-sm font-medium text-fg group-hover:text-brand">
                    {bookmark.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {bookmark.subject}
                  </span>
                </a>
                <Link
                  href={bookmark.path}
                  className="shrink-0 rounded-md p-1.5 text-muted hover:text-brand"
                  aria-label={`Open ${bookmark.subject} on the site`}
                  title="Open the subject page"
                >
                  <Icon name="book" className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(bookmark)}
                  className="shrink-0 rounded-md p-1.5 text-brand hover:text-fg"
                  aria-label={`Remove ${bookmark.title} from saved`}
                  title="Remove"
                >
                  <Icon name="bookmarkFilled" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="revised">
        <h2 id="revised" className="text-base font-semibold text-fg">
          Marked as revised{" "}
          {doneReady && done.length > 0 && (
            <span className="text-muted">({done.length})</span>
          )}
        </h2>

        {doneReady && done.length === 0 ? (
          <p className="card mt-3 p-6 text-center text-sm text-muted">
            Nothing ticked off yet. Open a subject and hit “Mark as revised” to
            track what you have covered.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {done.map((path) => (
              <li key={path} className="flex items-center gap-1">
                <Link
                  href={path}
                  className="rounded-full border border-lab/30 bg-lab/10 px-3.5 py-1.5 text-sm text-lab hover:opacity-80"
                >
                  {path.split("/").pop()?.replace(/-/g, " ")}
                </Link>
                <button
                  type="button"
                  onClick={() => toggleDone(path)}
                  className="rounded-md p-1 text-muted hover:text-fg"
                  aria-label={`Unmark ${path}`}
                  title="Unmark"
                >
                  <Icon name="close" className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
