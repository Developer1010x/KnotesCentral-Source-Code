export interface RecentEntry {
  path: string;
  title: string;
  subtitle: string;
}

const KEY = "knotes:recent";
const LIMIT = 6;

export function readRecent(): RecentEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (entry): entry is RecentEntry =>
          !!entry &&
          typeof entry === "object" &&
          typeof (entry as RecentEntry).path === "string" &&
          typeof (entry as RecentEntry).title === "string"
      )
      .slice(0, LIMIT);
  } catch {
    return [];
  }
}

/** Most recent first, de-duplicated by path. */
export function pushRecent(entry: RecentEntry) {
  if (typeof window === "undefined") return;

  try {
    const next = [
      entry,
      ...readRecent().filter((item) => item.path !== entry.path),
    ].slice(0, LIMIT);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable — recents are a convenience, not a requirement.
  }
}
