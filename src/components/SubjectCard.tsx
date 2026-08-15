import type { ReactNode } from "react";
import Link from "next/link";
import type { Semester, Subject } from "@/data/types";
import { Card } from "@/components/ui/Card";
import { CoverageBadges } from "@/components/ui/Badge";
import { NoteLink } from "@/components/NoteLink";
import { DoneBadge } from "@/components/Progress";
import { Icon } from "@/components/ui/icons";
import { countNotes, subjectSlug } from "@/lib/catalog";
import { isNew } from "@/lib/changelog";
import { countUsable, isGone } from "@/lib/linkHealth";
import { deadSince } from "@/lib/linkRot";

/**
 * Subject tile with its notes inline. The heading links to the subject's own
 * page; the notes open directly, because most readers want the file, not a
 * detour.
 */
export function SubjectCard({
  subject,
  semester,
  semesterPath,
  meta,
}: {
  subject: Subject;
  semester?: Semester;
  semesterPath: string;
  meta?: ReactNode;
}) {
  const counts = countNotes(subject.notes);
  const { usable, broken } = countUsable(subject.notes);
  const path = `${semesterPath}/${subjectSlug(subject, semester)}`;

  return (
    <Card interactive className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-snug text-fg">
            <Link href={path} className="group/title inline-flex items-start gap-1 hover:text-brand">
              {subject.name}
              <Icon
                name="arrowRight"
                className="mt-1 h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover/title:opacity-100"
              />
            </Link>
          </h2>
          {subject.subject_code && (
            <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-muted">
              {subject.subject_code}
            </p>
          )}
        </div>
        <span className="shrink-0 text-right text-xs font-medium text-muted">
          <span className="block">
            {usable} {usable === 1 ? "resource" : "resources"}
          </span>
          {broken > 0 && (
            <span className="block text-paper">{broken} unavailable</span>
          )}
          <DoneBadge path={path} />
        </span>
      </div>

      {meta}

      <CoverageBadges counts={counts} className="mt-3" />

      <div className="mt-3 space-y-1 border-t border-line pt-2">
        {subject.notes.length > 0 ? (
          subject.notes.map((note) => (
            <NoteLink
              key={`${note.title}-${note.link}`}
              note={note}
              subject={subject.name}
              path={path}
              isNew={isNew(note)}
                isGone={isGone(note)}
              deadSince={deadSince(note)}
            />
          ))
        ) : (
          <p className="p-3 text-sm text-muted">
            No resources uploaded for this subject yet.
          </p>
        )}
      </div>
    </Card>
  );
}
