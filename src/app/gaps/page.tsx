import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/icons";
import { AddNotesButton } from "@/components/ContributeCTA";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  catalogStats,
  subjectPath,
  subjectsNeedingHelp,
  type SubjectLocation,
} from "@/lib/catalog";
import { goneCount, isUsable, LINK_CHECKED_AT } from "@/lib/linkHealth";
import { SITE, addNotesIssueUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help needed",
  description:
    "Subjects on KnotesNeo with no working material — the fastest way to help the batches behind you.",
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function GapsPage() {
  const gaps = subjectsNeedingHelp(isUsable);
  const stats = catalogStats();
  const broken = goneCount();

  // Group by department so someone can scan straight to their own branch.
  const byDepartment = new Map<string, SubjectLocation[]>();
  for (const gap of gaps) {
    const key = gap.department.name;
    byDepartment.set(key, [...(byDepartment.get(key) ?? []), gap]);
  }

  const departments = Array.from(byDepartment.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Help needed"
        title="Subjects with nothing left"
        description={`RVCE accounts are purged after students graduate, and the Drive folders they owned go with them. ${broken} links on ${SITE.name} are confirmed dead, which leaves the subjects below with no working material at all. If you have any of these files, re-uploading one takes a minute.`}
        trail={[{ label: "Departments", href: "/" }, { label: "Help needed" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <AddNotesButton label="Upload what you have" />
          <span className="text-sm text-muted">
            {gaps.length} of {stats.subjects} subjects affected
            {LINK_CHECKED_AT &&
              ` · links last checked ${DATE.format(new Date(LINK_CHECKED_AT))}`}
          </span>
        </div>
      </PageHeader>

      {gaps.length === 0 ? (
        <EmptyState
          icon="check"
          title="Nothing is missing"
          description="Every subject in the catalog has at least one working resource. That is rare — thank whoever fixed it."
          action={{ label: "Browse departments", href: "/" }}
        />
      ) : (
        departments.map(([department, items]) => (
          <section key={department} aria-labelledby={`dept-${department}`}>
            <div className="mb-3 flex flex-wrap items-baseline gap-3 border-b border-line pb-2">
              <h2
                id={`dept-${department}`}
                className="text-base font-semibold text-fg"
              >
                {department}
              </h2>
              <span className="text-sm text-muted">
                {items.length} {items.length === 1 ? "subject" : "subjects"}
              </span>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              {items.map((gap) => (
                <li
                  key={subjectPath(gap)}
                  className="card flex items-center justify-between gap-3 p-3.5"
                >
                  <Link
                    href={subjectPath(gap)}
                    className="group min-w-0 flex-1"
                  >
                    <span className="block truncate text-sm font-medium text-fg group-hover:text-brand">
                      {gap.subject.name}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {gap.subject.subject_code
                        ? `${gap.subject.subject_code} · `
                        : ""}
                      Year {gap.year.year} · Semester {gap.semester.number}
                    </span>
                  </Link>

                  <a
                    href={addNotesIssueUrl({
                      department: gap.department.name,
                      year: gap.year.year,
                      semester: gap.semester.number,
                      subject: gap.subject.name,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-brand hover:border-brand/40"
                  >
                    I have this
                    <Icon name="external" className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
