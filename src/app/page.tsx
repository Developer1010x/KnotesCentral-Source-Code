import Link from "next/link";
import { departments } from "@/data/departments";
import { CardGrid } from "@/components/ui/Card";
import { CoverageBadges } from "@/components/ui/Badge";
import { TileLink } from "@/components/ui/TileLink";
import { Icon } from "@/components/ui/icons";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { MySemester } from "@/components/MySemester";
import {
  catalogStats,
  countNotes,
  departmentNotes,
  departmentOptions,
  subjectCount,
} from "@/lib/catalog";
import { lastUpdated } from "@/lib/changelog";
import { contributors } from "@/data/contributors";
import { SITE } from "@/lib/site";
import { AddNotesButton, ContributeBanner } from "@/components/ContributeCTA";

const stats = catalogStats();
const updated = lastUpdated();
const UPDATED_FORMAT = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-card border border-line bg-surface px-4 py-3">
      <p className="text-2xl font-bold tabular-nums text-fg">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
          For every RVCE batch
        </p>
        <h1 className="mt-2 max-w-3xl text-display font-bold text-fg">
          Every note, lab manual and question paper — in one place.
        </h1>
        <p className="mt-4 max-w-prose text-base leading-7 text-muted">
          {SITE.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-contrast hover:opacity-90"
          >
            <Icon name="search" className="h-4 w-4" />
            Find a subject
          </Link>
          <AddNotesButton label="Contribute notes" variant="outline" />
        </div>

        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={stats.departments} label="Departments" />
          <Stat value={stats.subjects} label="Subjects" />
          <Stat value={stats.notes} label="Resources" />
          <Stat value={contributors.length} label="Contributors" />
        </div>
      </section>

      <MySemester options={departmentOptions()} />

      <RecentlyViewed />

      <section aria-labelledby="departments-heading">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
          <div>
            <h2
              id="departments-heading"
              className="text-lg font-semibold text-fg"
            >
              Browse by department
            </h2>
            <p className="mt-1 text-sm text-muted">
              Pick yours, then the year and semester you are in.
            </p>
          </div>
          {updated && (
            <Link
              href="/whats-new"
              className="shrink-0 text-sm font-medium text-brand hover:underline"
            >
              Updated {UPDATED_FORMAT.format(new Date(updated))} →
            </Link>
          )}
        </div>

        <CardGrid>
          {departments.map((department) => (
            <TileLink
              key={department.link}
              href={department.link}
              icon="book"
              title={department.name}
              meta={`${subjectCount(department)} subjects · ${
                department.years.length
              } years`}
            >
              <CoverageBadges counts={countNotes(departmentNotes(department))} />
            </TileLink>
          ))}
        </CardGrid>
      </section>

      <ContributeBanner />

    </div>
  );
}
