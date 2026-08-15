"use client";

import type { Note } from "@/data/types";
import { Badge, NoteTypeBadge } from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/ui/icons";
import { HOST_LABEL, noteHost } from "@/lib/noteTypes";
import { useBookmarks } from "@/lib/prefs";
import { addNotesIssueUrl } from "@/lib/site";

/** "Dead since March 2026" reads better than a full date on a badge. */
const DEAD_SINCE = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const HOST_ICON: Record<ReturnType<typeof noteHost>, IconName> = {
  drive: "drive",
  docs: "drive",
  github: "github",
  campus: "wifi",
  link: "external",
};

/**
 * One note: opens where it is hosted, and can be starred to the reader's shelf.
 * `isNew` is decided on the server so the badge is in the prerendered HTML.
 */
export function NoteLink({
  note,
  subject,
  path,
  isNew = false,
  isGone = false,
  deadSince,
}: {
  note: Note;
  subject: string;
  path: string;
  isNew?: boolean;
  /** Link was dead at the last automated check — decided on the server. */
  isGone?: boolean;
  /** ISO date of the first check that saw it dead, when one is recorded. */
  deadSince?: string;
}) {
  const host = noteHost(note);
  const { has, toggle, hydrated } = useBookmarks();
  const saved = hydrated && has(note.link);

  // Some entries name material nobody has uploaded yet. Say so plainly rather
  // than handing the reader a link that goes nowhere.
  if (!note.link.trim()) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-dashed border-line p-3">
        <span className="mt-0.5 text-muted">
          <Icon name="inbox" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-snug text-muted">
            {note.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-2">
            <NoteTypeBadge type={note.type} />
            <span className="text-xs text-muted">Not uploaded yet</span>
          </span>
        </div>
        <a
          href={addNotesIssueUrl({ subject })}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold text-brand hover:underline"
        >
          Have it?
        </a>
      </div>
    );
  }

  // Dead link: say so up front rather than letting someone lose a click, but
  // keep it reachable — the check runs anonymously and can be wrong.
  if (isGone) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-dashed border-paper/40 bg-paper/5 p-3">
        <span className="mt-0.5 text-paper">
          <Icon name="inbox" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-snug text-muted line-through decoration-muted/40">
            {note.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-2">
            <NoteTypeBadge type={note.type} />
            <Badge className="bg-paper/10 text-paper ring-1 ring-inset ring-paper/25">
              {deadSince ? `Dead since ${DEAD_SINCE.format(new Date(deadSince))}` : "Link deleted"}
            </Badge>
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-3 text-xs">
            <a
              href={addNotesIssueUrl({ subject })}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand hover:underline"
            >
              Send a replacement
            </a>
            <a
              href={note.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg"
            >
              Try it anyway
            </a>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="group/note flex items-start gap-2 rounded-lg border border-transparent p-3 transition hover:border-line hover:bg-raised">
      <a
        href={note.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-1 items-start gap-3"
      >
        <span className="mt-0.5 text-muted transition group-hover/note:text-brand">
          <Icon name={HOST_ICON[host]} className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-snug text-fg group-hover/note:text-brand">
            {note.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-2">
            <NoteTypeBadge type={note.type} />
            {isNew && (
              <Badge className="bg-accent/10 text-accent ring-1 ring-inset ring-accent/25">
                New
              </Badge>
            )}
            <span className="text-xs text-muted">{HOST_LABEL[host]}</span>
          </span>
        </span>
      </a>

      <button
        type="button"
        onClick={() =>
          toggle({ link: note.link, title: note.title, subject, path })
        }
        aria-pressed={saved}
        aria-label={saved ? `Remove ${note.title} from saved` : `Save ${note.title}`}
        title={saved ? "Saved — click to remove" : "Save for later"}
        className={`mt-0.5 shrink-0 rounded-md p-1.5 transition ${
          saved
            ? "text-brand"
            : "text-muted opacity-0 focus:opacity-100 group-hover/note:opacity-100"
        }`}
      >
        <Icon name={saved ? "bookmarkFilled" : "bookmark"} className="h-4 w-4" />
      </button>
    </div>
  );
}
