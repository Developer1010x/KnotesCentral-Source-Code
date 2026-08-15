/**
 * One stroked-24 icon set. Every icon is a single path so they share a
 * component; add new glyphs by adding a path here, not a new file.
 */
const PATHS = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  book: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  chevronRight: "M9 5l7 7-7 7",
  arrowRight: "M13 7l5 5m0 0l-5 5m5-5H6",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  layers:
    "M19 11l-7 4-7-4m14 4l-7 4-7-4m14-8l-7 4-7-4 7-4 7 4z",
  sun: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  moon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 18L18 6M6 6l12 12",
  external:
    "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
  drive: "M7 16a4 4 0 01-.88-7.9A5 5 0 1115.9 6H16a5 5 0 010 10H7z",
  github:
    "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0019 4.77 5.07 5.07 0 0018.91 1S17.73.65 15 2.48a13.38 13.38 0 00-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 004 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 008 18.13V22",
  users:
    "M17 20h5v-2a3 3 0 00-5.36-1.87M17 20H7m10 0v-2c0-.66-.13-1.29-.36-1.87m0 0a5 5 0 00-9.28 0M7 20H2v-2a3 3 0 015.36-1.87M7 20v-2c0-.66.13-1.29.36-1.87m0 0a5 5 0 019.28 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  sparkles:
    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  check: "M5 13l4 4L19 7",
  inbox:
    "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0h-3.28a2 2 0 00-1.789 1.106l-.842 1.788A2 2 0 0112.28 17h-.56a2 2 0 01-1.789-1.106l-.842-1.788A2 2 0 007.28 13H4m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5",
  plus: "M12 6v6m0 0v6m0-6h6m-6 0H6",
  bookmark: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  share:
    "M8.7 10.7a3 3 0 100 2.6m0-2.6l6.6-3.4m-6.6 6l6.6 3.4M21 5a3 3 0 11-6 0 3 3 0 016 0zm0 14a3 3 0 11-6 0 3 3 0 016 0z",
  copy: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2m-6-3h8a2 2 0 002-2V5a2 2 0 00-2-2h-8a2 2 0 00-2 2v9a2 2 0 002 2z",
  download: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3",
  filter: "M3 4h18l-7 8v6l-4 2v-8L3 4z",
  target:
    "M12 3v2m0 14v2m9-9h-2M5 12H3m16 0a7 7 0 11-14 0 7 7 0 0114 0zm-4 0a3 3 0 11-6 0 3 3 0 016 0z",
  wifi: "M5 12.55a11 11 0 0114 0M8.5 16.1a6 6 0 017 0M2 8.82a15 15 0 0120 0M12 20h.01",
  chart: "M4 20V10m6 10V4m6 16v-7m-14 7h18",
} as const;

/** Solid variants, for toggled-on states. */
const SOLID = {
  bookmarkFilled: "M7 3h10a2 2 0 012 2v16l-7-3.5L5 21V5a2 2 0 012-2z",
  checkCircle:
    "M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4-6.3 6.3z",
} as const;

export type IconName = keyof typeof PATHS | keyof typeof SOLID;

export function Icon({
  name,
  className = "w-5 h-5",
}: {
  name: IconName;
  className?: string;
}) {
  const solid = name in SOLID;

  return (
    <svg
      className={className}
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d={solid ? SOLID[name as keyof typeof SOLID] : PATHS[name as keyof typeof PATHS]}
      />
    </svg>
  );
}
