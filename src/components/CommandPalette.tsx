"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { IndexEntry, PageEntry } from "@/lib/searchIndex";
import { Icon } from "@/components/ui/icons";
import { NoteTypeBadge } from "@/components/ui/Badge";
import { useStored } from "@/lib/prefs";

type Row =
  | { kind: "page"; page: PageEntry }
  | { kind: "subject"; entry: IndexEntry };

const rowPath = (row: Row) =>
  row.kind === "page" ? row.page.path : row.entry.path;

/**
 * Site-wide search on ⌘K / Ctrl-K. Matches subjects, note titles, departments
 * and the site's own pages. The catalog index is imported lazily on first open,
 * so it costs nothing on pages the reader never searches from.
 */
export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [ready, setReady] = useState(false);
  const { value: recent, setValue: setRecent } = useStored<string[]>(
    "knotes:recent-searches",
    []
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    import("@/lib/searchIndex").then(({ queryIndex, queryPages }) => {
      if (cancelled) return;
      setReady(true);
      setRows([
        ...queryPages(query).map((page) => ({ kind: "page" as const, page })),
        ...queryIndex(query, 12).map((entry) => ({
          kind: "subject" as const,
          entry,
        })),
      ]);
    });

    return () => {
      cancelled = true;
    };
  }, [open, query]);

  useEffect(() => {
    if (!open) return;

    setActive(0);
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = useCallback(
    (row: Row) => {
      const term = query.trim();
      if (term) {
        setRecent([term, ...recent.filter((item) => item !== term)].slice(0, 5));
      }
      onClose();
      setQuery("");
      router.push(rowPath(row));
    },
    [onClose, query, recent, router, setRecent]
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") return onClose();
    if (!rows.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % rows.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + rows.length) % rows.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(rows[active]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-card border border-line bg-surface shadow-lift animate-fade-up">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" className="h-5 w-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search subjects, codes, notes or pages…"
            className="w-full bg-transparent py-4 text-[0.975rem] text-fg outline-none placeholder:text-muted"
            aria-label="Search"
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-muted sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {!query && recent.length > 0 && (
            <div className="px-1 pb-2">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted">
                Recent searches
              </p>
              <div className="flex flex-wrap gap-1.5 px-2">
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-line px-3 py-1 text-xs text-fg hover:border-brand/40 hover:text-brand"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <p className="px-3 py-6 text-center text-sm text-muted">
              Type a subject like <em>Data Structures</em>, a code like{" "}
              <em>CSE201</em>, or a page like <em>contribute</em>.
            </p>
          )}

          {query && ready && rows.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted">
              Nothing matches “{query}”. It may not be uploaded yet.
            </p>
          )}

          {rows.map((row, i) => (
            <button
              key={`${row.kind}-${rowPath(row)}-${i}`}
              type="button"
              onClick={() => go(row)}
              onMouseEnter={() => setActive(i)}
              className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                i === active ? "bg-brand-soft" : "hover:bg-raised"
              }`}
            >
              <span className="mt-0.5 text-brand">
                <Icon
                  name={row.kind === "page" ? "arrowRight" : "book"}
                  className="h-4 w-4"
                />
              </span>

              {row.kind === "page" ? (
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">
                    {row.page.name}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {row.page.hint}
                  </span>
                </span>
              ) : (
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">
                    {row.entry.name}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {row.entry.code ? `${row.entry.code} · ` : ""}
                    {row.entry.department} · Year {row.entry.year} · Sem{" "}
                    {row.entry.semester}
                  </span>
                  {row.entry.types.length > 0 && (
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {row.entry.types.map((type) => (
                        <NoteTypeBadge key={type} type={type} />
                      ))}
                    </span>
                  )}
                </span>
              )}

              {row.kind === "subject" && (
                <span className="shrink-0 text-xs text-muted">
                  {row.entry.notes}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[11px] text-muted">
          <span>↑↓ to move · ↵ to open</span>
          <span>{rows.length ? `${rows.length} results` : ""}</span>
        </div>
      </div>
    </div>
  );
}
