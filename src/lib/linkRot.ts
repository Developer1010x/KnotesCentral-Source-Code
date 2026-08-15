import history from "@/data/generated/link-history.json";
import type { Note } from "@/data/types";
import { allSubjects, departmentSlug } from "@/lib/catalog";
import { isGone } from "@/lib/linkHealth";
import { noteHost, HOST_LABEL, type NoteHost } from "@/lib/noteTypes";

/**
 * The link-rot record.
 *
 * `scripts/check-links.mjs --write` appends one entry per weekly run instead of
 * overwriting the last, which is what lets the site say "dead since March"
 * rather than only "dead". Everything here is derived at build time; nothing in
 * this module reaches the browser except the numbers it renders.
 */

export interface LinkRecord {
  status: string;
  /** First check that saw this link broken. */
  firstDead: string;
  /** Most recent check that saw it broken. */
  lastDead: string;
  /** Set when a broken link started working again. */
  recoveredAt?: string;
}

export interface RunRecord {
  checkedAt: string;
  /** Resources checked. Absent on the run seeded from the first snapshot. */
  checked?: number;
  gone: number;
  byStatus?: Record<string, number>;
  /** True for the run reconstructed from the pre-history snapshot. */
  seeded?: boolean;
}

const LINKS = (history as { links?: Record<string, LinkRecord> }).links ?? {};
const RUNS = ((history as { runs?: RunRecord[] }).runs ?? [])
  .slice()
  .sort((a, b) => a.checkedAt.localeCompare(b.checkedAt));

export const runs = (): RunRecord[] => RUNS;

export const latestRun = (): RunRecord | undefined => RUNS[RUNS.length - 1];

/** When this link was first recorded broken, if it is broken now. */
export function deadSince(note: Note): string | undefined {
  const record = LINKS[note.link];
  if (!record || record.recoveredAt) return undefined;
  return record.firstDead;
}

/** Whole days a link has been broken, counted from the first check that saw it. */
export function deadForDays(note: Note, now = Date.now()): number | undefined {
  const since = deadSince(note);
  if (!since) return undefined;
  return Math.max(
    0,
    Math.floor((now - new Date(since).getTime()) / 86_400_000)
  );
}

/** Links that were broken and now work again — rescues, and they do happen. */
export function recoveredCount(): number {
  return Object.values(LINKS).filter((record) => record.recoveredAt).length;
}

/* ------------------------------------------------------------ aggregation */

export interface RotSlice {
  key: string;
  label: string;
  total: number;
  dead: number;
  /** 0-1. */
  share: number;
}

const slice = (key: string, label: string, notes: Note[]): RotSlice => {
  const linked = notes.filter((note) => note.link.trim());
  const dead = linked.filter((note) => isGone(note)).length;
  return {
    key,
    label,
    total: linked.length,
    dead,
    share: linked.length ? dead / linked.length : 0,
  };
};

/** Every note in the catalog, deduplicated by link. */
function uniqueNotes(): Note[] {
  const seen = new Set<string>();
  const notes: Note[] = [];

  for (const location of allSubjects()) {
    for (const note of location.subject.notes) {
      const key = note.link.trim() || `unlinked:${location.subject.name}:${note.title}`;
      if (seen.has(key)) continue;
      seen.add(key);
      notes.push(note);
    }
  }

  return notes;
}

/**
 * Rot by where the material is hosted. This is the finding that matters: Drive
 * folders die with the account that owned them, public GitHub repos do not.
 */
export function rotByHost(): RotSlice[] {
  const buckets = new Map<NoteHost, Note[]>();

  for (const note of uniqueNotes()) {
    if (!note.link.trim()) continue;
    const host = noteHost(note);
    buckets.set(host, [...(buckets.get(host) ?? []), note]);
  }

  return [...buckets.entries()]
    .map(([host, notes]) => slice(host, HOST_LABEL[host], notes))
    .sort((a, b) => b.total - a.total);
}

/**
 * Rot by department, worst first — where volunteers are needed most.
 *
 * Counted per department, deduplicated within it but not across departments: a
 * Drive folder shared by two branches is a broken card in both, so these totals
 * add up to more than the number of distinct dead links.
 */
export function rotByDepartment(): RotSlice[] {
  const buckets = new Map<string, { label: string; notes: Note[]; seen: Set<string> }>();

  for (const location of allSubjects()) {
    const key = departmentSlug(location.department);
    const bucket = buckets.get(key) ?? {
      label: location.department.name,
      notes: [],
      seen: new Set<string>(),
    };

    for (const note of location.subject.notes) {
      const id = note.link.trim() || `unlinked:${location.subject.name}:${note.title}`;
      if (bucket.seen.has(id)) continue;
      bucket.seen.add(id);
      bucket.notes.push(note);
    }

    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .map(([key, { label, notes }]) => slice(key, label, notes))
    .filter((entry) => entry.total > 0)
    .sort((a, b) => b.share - a.share || b.dead - a.dead);
}

export interface RotSummary {
  /** Distinct links in the catalog. */
  links: number;
  dead: number;
  share: number;
  recovered: number;
  checks: number;
  firstCheck?: string;
  lastCheck?: string;
  /** Longest time any currently-broken link has been broken, in days. */
  longestDeadDays: number;
}

export function rotSummary(now = Date.now()): RotSummary {
  const linked = uniqueNotes().filter((note) => note.link.trim());
  const dead = linked.filter((note) => isGone(note));
  const longest = dead.reduce(
    (max, note) => Math.max(max, deadForDays(note, now) ?? 0),
    0
  );

  return {
    links: linked.length,
    dead: dead.length,
    share: linked.length ? dead.length / linked.length : 0,
    recovered: recoveredCount(),
    checks: RUNS.length,
    firstCheck: RUNS[0]?.checkedAt,
    lastCheck: RUNS[RUNS.length - 1]?.checkedAt,
    longestDeadDays: longest,
  };
}
