import { departments } from "@/data/departments";
import type { NoteType } from "@/data/types";
import { countNotes } from "@/lib/catalog";

export interface IndexEntry {
  /** Subject name. */
  name: string;
  code: string;
  department: string;
  year: number;
  semester: number;
  path: string;
  notes: number;
  types: NoteType[];
  /** Note titles, lowercased, joined — searched but never displayed. */
  haystack: string;
}

/**
 * Flat, compact index for the command palette. Lives in its own module so a
 * dynamic import keeps the full catalog out of the initial JS bundle.
 */
export const SEARCH_INDEX: IndexEntry[] = departments.flatMap((department) =>
  department.years.flatMap((year) =>
    year.semesters.flatMap((semester) =>
      semester.subjects.map((subject) => {
        const counts = countNotes(subject.notes);
        return {
          name: subject.name,
          code: subject.subject_code,
          department: department.name,
          year: year.year,
          semester: semester.number,
          path: `${department.link}/${year.year}/${semester.number}`,
          notes: counts.total,
          types: (["theory", "lab", "question-paper"] as NoteType[]).filter(
            (type) => counts[type] > 0
          ),
          haystack: [
            subject.name,
            subject.subject_code,
            department.name,
            ...subject.notes.map((note) => note.title),
          ]
            .join(" ")
            .toLowerCase(),
        };
      })
    )
  )
);

/** Non-subject destinations, so the palette can navigate the whole site. */
export interface PageEntry {
  name: string;
  path: string;
  hint: string;
}

export const PAGE_INDEX: PageEntry[] = [
  { name: "All departments", path: "/", hint: "Browse the catalog" },
  { name: "Search subjects", path: "/search", hint: "Full search page" },
  { name: "What's new", path: "/whats-new", hint: "Recently added material" },
  { name: "Saved", path: "/saved", hint: "Your bookmarks and progress" },
  { name: "Contribute notes", path: "/contribute", hint: "Add material" },
  { name: "Contributors", path: "/contributors", hint: "Who built this" },
  { name: "About", path: "/about", hint: "What this is" },
  { name: "Contact", path: "/contact", hint: "Get in touch" },
  ...departments.map((department) => ({
    name: department.name,
    path: department.link,
    hint: "Department",
  })),
];

export function queryPages(query: string, limit = 5): PageEntry[] {
  const needle = query.toLowerCase().trim();
  if (!needle) return [];

  return PAGE_INDEX.filter((page) =>
    page.name.toLowerCase().includes(needle)
  ).slice(0, limit);
}

export function queryIndex(query: string, limit = 24): IndexEntry[] {
  const needle = query.toLowerCase().trim();
  if (!needle) return [];

  const scored: Array<{ entry: IndexEntry; score: number }> = [];

  for (const entry of SEARCH_INDEX) {
    const code = entry.code.toLowerCase();
    const name = entry.name.toLowerCase();

    let score = 0;
    if (code === needle) score = 100;
    else if (code.startsWith(needle)) score = 85;
    else if (name.startsWith(needle)) score = 75;
    else if (name.includes(needle)) score = 55;
    else if (code.includes(needle)) score = 45;
    else if (entry.haystack.includes(needle)) score = 25;

    if (score) scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .slice(0, limit)
    .map((hit) => hit.entry);
}
