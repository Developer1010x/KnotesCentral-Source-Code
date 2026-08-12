"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Jump straight to another semester of the same department. Beats going
 * back up two levels, which is what the tree structure otherwise forces.
 */
export function SemesterSwitcher({
  departmentLink,
  years,
  current,
}: {
  departmentLink: string;
  years: { year: number; semesters: number[] }[];
  current: { year: number; semester: number };
}) {
  const pathname = usePathname();
  const suffix = pathname.endsWith("/exam-prep") ? "/exam-prep" : "";

  return (
    <nav aria-label="Other semesters" className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted">
        Jump to
      </span>
      {years.flatMap((year) =>
        year.semesters.map((semester) => {
          const active =
            year.year === current.year && semester === current.semester;

          return (
            <Link
              key={`${year.year}-${semester}`}
              href={`${departmentLink}/${year.year}/${semester}${suffix}`}
              aria-current={active ? "page" : undefined}
              title={`Year ${year.year}, semester ${semester}`}
              className={`rounded-md px-2.5 py-1 text-xs font-medium tabular-nums transition ${
                active
                  ? "bg-brand text-brand-contrast"
                  : "border border-line text-muted hover:border-brand/40 hover:text-brand"
              }`}
            >
              S{semester}
            </Link>
          );
        })
      )}
    </nav>
  );
}
