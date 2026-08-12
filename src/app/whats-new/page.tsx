import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoteLink } from "@/components/NoteLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { isNew, recentNotes } from "@/lib/changelog";
import { isGone } from "@/lib/linkHealth";
import { subjectPath } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "What's new",
  description:
    "Notes, lab manuals and question papers most recently added to KnotesNeo.",
};

const MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function WhatsNewPage() {
  const feed = recentNotes(80);

  // Group by month so a batch upload reads as one event, not forty.
  const months = new Map<string, typeof feed>();
  for (const item of feed) {
    const label = MONTH.format(new Date(item.date));
    months.set(label, [...(months.get(label) ?? []), item]);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Updates"
        title="What's new"
        description="The most recently added material, newest first. Dates come from the repository history, so this page is never out of date."
        trail={[{ label: "Departments", href: "/" }, { label: "What's new" }]}
      />

      {feed.length === 0 ? (
        <EmptyState
          icon="clock"
          title="No dated entries yet"
          description="Upload dates are read from the repository history. Once notes are added through the normal flow, they show up here automatically."
        />
      ) : (
        Array.from(months.entries()).map(([month, items]) => (
          <section key={month} aria-labelledby={`month-${month}`}>
            <div className="mb-3 flex items-baseline gap-3 border-b border-line pb-2">
              <h2
                id={`month-${month}`}
                className="text-base font-semibold text-fg"
              >
                {month}
              </h2>
              <span className="text-sm text-muted">
                {items.length} {items.length === 1 ? "resource" : "resources"}
              </span>
            </div>

            <div className="card divide-y divide-line p-2">
              {items.map((item) => {
                const path = `${subjectPath(item.location)}`;
                return (
                  <div key={`${item.note.link}-${item.note.title}`}>
                    <NoteLink
                      note={item.note}
                      subject={item.location.subject.name}
                      path={path}
                      isNew={isNew(item.note)}
                      isGone={isGone(item.note)}
                    />
                    <Link
                      href={path}
                      className="-mt-1 mb-2 ml-11 inline-block text-xs text-muted hover:text-brand"
                    >
                      {item.location.subject.name} ·{" "}
                      {item.location.department.name} · Sem{" "}
                      {item.location.semester.number}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
