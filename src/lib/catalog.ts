import { departments } from "@/data/departments";
import type {
  Department,
  Note,
  NoteType,
  Semester,
  Subject,
  Year,
} from "@/data/types";

/** The URL segment a department is reachable at, derived from its `link`. */
export function departmentSlug(department: Department): string {
  return department.link.replace(/^\//, "");
}

export function findDepartment(slug: string): Department | undefined {
  const wanted = decodeURIComponent(slug).toLowerCase();
  return departments.find(
    (department) => departmentSlug(department).toLowerCase() === wanted
  );
}

export function findYear(
  department: Department | undefined,
  year: string
): Year | undefined {
  return department?.years.find((y) => y.year === Number(year));
}

export function findSemester(
  year: Year | undefined,
  semester: string
): Semester | undefined {
  return year?.semesters.find((s) => s.number === Number(semester));
}

/* ------------------------------------------------------------------ counts */

export type NoteCounts = Record<NoteType, number> & { total: number };

function emptyCounts(): NoteCounts {
  return { theory: 0, lab: 0, "question-paper": 0, total: 0 };
}

export function countNotes(notes: Note[]): NoteCounts {
  return notes.reduce((counts, note) => {
    if (note.type in counts) counts[note.type] += 1;
    counts.total += 1;
    return counts;
  }, emptyCounts());
}

export const semesterNotes = (semester: Semester): Note[] =>
  semester.subjects.flatMap((subject) => subject.notes);

export const yearNotes = (year: Year): Note[] =>
  year.semesters.flatMap(semesterNotes);

export const departmentNotes = (department: Department): Note[] =>
  department.years.flatMap(yearNotes);

export function subjectCount(department: Department): number {
  return department.years.reduce(
    (total, year) =>
      total +
      year.semesters.reduce((sum, sem) => sum + sem.subjects.length, 0),
    0
  );
}

/** Headline numbers for the home page. Computed once at build time. */
export function catalogStats() {
  const notes = departments.flatMap(departmentNotes);
  return {
    departments: departments.length,
    subjects: departments.reduce((n, d) => n + subjectCount(d), 0),
    notes: notes.length,
    counts: countNotes(notes),
  };
}

/** Note types that actually appear in the data — drives the filter chips. */
export function availableNoteTypes(): NoteType[] {
  const counts = catalogStats().counts;
  return (["theory", "lab", "question-paper"] as NoteType[]).filter(
    (type) => counts[type] > 0
  );
}

/** Compact department → years → semesters tree for client-side pickers. */
export function departmentOptions() {
  return departments.map((department) => ({
    link: department.link,
    name: department.name,
    years: department.years.map((year) => ({
      year: year.year,
      semesters: year.semesters.map((semester) => semester.number),
    })),
  }));
}

/* ------------------------------------------------------------------- slugs */

/** URL-safe subject slug: "Data Structures & its Applications" -> "data-structures-its-applications". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Subject slug, unique within its semester. Two subjects with the same name
 * fall back to name + code, which the data guarantees to differ.
 */
export function subjectSlug(subject: Subject, semester?: Semester): string {
  const base = slugify(subject.name) || slugify(subject.subject_code) || "subject";
  if (!semester) return base;

  const clashes = semester.subjects.filter(
    (other) => (slugify(other.name) || slugify(other.subject_code)) === base
  );
  if (clashes.length < 2) return base;

  return `${base}-${slugify(subject.subject_code)}`;
}

export function findSubject(
  semester: Semester | undefined,
  slug: string
): Subject | undefined {
  if (!semester) return undefined;
  const wanted = decodeURIComponent(slug).toLowerCase();
  return semester.subjects.find(
    (subject) => subjectSlug(subject, semester) === wanted
  );
}

/* ------------------------------------------------------------------ search */

export interface SubjectLocation {
  department: Department;
  year: Year;
  semester: Semester;
  subject: Subject;
}

export function semesterPath({
  department,
  year,
  semester,
}: Omit<SubjectLocation, "subject">): string {
  return `${department.link}/${year.year}/${semester.number}`;
}

/** Path to a semester listing, or to a subject page when one is given. */
export function subjectPath(location: SubjectLocation | Omit<SubjectLocation, "subject">): string {
  const base = semesterPath(location);
  const subject = (location as SubjectLocation).subject;
  return subject
    ? `${base}/${subjectSlug(subject, location.semester)}`
    : base;
}

/** Stable identity for a subject across renders and localStorage. */
export function subjectKey(location: SubjectLocation): string {
  return subjectPath(location);
}

/** Every subject in the catalog, tagged with where it lives. */
export function allSubjects(): SubjectLocation[] {
  return departments.flatMap((department) =>
    department.years.flatMap((year) =>
      year.semesters.flatMap((semester) =>
        semester.subjects.map((subject) => ({
          department,
          year,
          semester,
          subject,
        }))
      )
    )
  );
}

export interface SearchHit extends SubjectLocation {
  score: number;
  /** Note titles that matched, so the UI can show why this hit surfaced. */
  matchedNotes: Note[];
}

const normalize = (value: string) => value.toLowerCase().trim();

/**
 * Ranked substring search over subject code, subject name and note titles.
 * Deliberately not fuzzy: subject codes are short and a typo-tolerant match
 * on "CS" style prefixes produces more noise than help.
 */
export function searchSubjects(
  query: string,
  options: { types?: NoteType[] } = {}
): SearchHit[] {
  const needle = normalize(query);
  const types = options.types?.length ? new Set(options.types) : null;

  const scoped = types
    ? allSubjects()
        .map((location) => ({
          ...location,
          subject: {
            ...location.subject,
            notes: location.subject.notes.filter((n) => types.has(n.type)),
          },
        }))
        .filter((location) => location.subject.notes.length > 0)
    : allSubjects();

  if (!needle) return scoped.map((l) => ({ ...l, score: 0, matchedNotes: [] }));

  const hits: SearchHit[] = [];

  for (const location of scoped) {
    const { subject } = location;
    const code = normalize(subject.subject_code);
    const name = normalize(subject.name);
    const matchedNotes = subject.notes.filter((note) =>
      normalize(note.title).includes(needle)
    );

    let score = 0;
    if (code === needle) score = 100;
    else if (code.startsWith(needle)) score = 80;
    else if (name.startsWith(needle)) score = 70;
    else if (name.includes(needle)) score = 50;
    else if (code.includes(needle)) score = 40;
    else if (matchedNotes.length) score = 25;

    if (score > 0) hits.push({ ...location, score, matchedNotes });
  }

  return hits.sort(
    (a, b) => b.score - a.score || a.subject.name.localeCompare(b.subject.name)
  );
}
