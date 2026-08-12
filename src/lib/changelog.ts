import added from "@/data/generated/added.json";
import { departments } from "@/data/departments";
import type { Note } from "@/data/types";
import { allSubjects, subjectPath, type SubjectLocation } from "@/lib/catalog";

const DATES = added as Record<string, string>;

/** How long a note wears the "New" badge. */
export const NEW_FOR_DAYS = 30;

export function addedAt(note: Note): string | undefined {
  return DATES[note.link];
}

export function isNew(note: Note, now = Date.now()): boolean {
  const date = addedAt(note);
  if (!date) return false;
  return now - new Date(date).getTime() < NEW_FOR_DAYS * 86_400_000;
}

export interface FeedItem {
  note: Note;
  date: string;
  location: SubjectLocation;
  path: string;
}

/** Every dated note, newest first — the What's New feed. */
export function recentNotes(limit = 60): FeedItem[] {
  const items: FeedItem[] = [];

  for (const location of allSubjects()) {
    for (const note of location.subject.notes) {
      const date = addedAt(note);
      if (date) {
        items.push({ note, date, location, path: subjectPath(location) });
      }
    }
  }

  return items
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/** Newest note date in the catalog — used for "last updated" copy. */
export function lastUpdated(): string | undefined {
  return recentNotes(1)[0]?.date;
}

export function countNewNotes(now = Date.now()): number {
  return departments
    .flatMap((department) =>
      department.years.flatMap((year) =>
        year.semesters.flatMap((semester) =>
          semester.subjects.flatMap((subject) => subject.notes)
        )
      )
    )
    .filter((note) => isNew(note, now)).length;
}
