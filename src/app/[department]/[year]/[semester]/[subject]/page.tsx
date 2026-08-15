import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { departments } from "@/data/departments";
import { PageHeader } from "@/components/ui/PageHeader";
import { CoverageBadges } from "@/components/ui/Badge";
import { NoteLink } from "@/components/NoteLink";
import { ShareButton } from "@/components/ShareButton";
import { DoneToggle } from "@/components/Progress";
import { TrackVisit } from "@/components/RecentlyViewed";
import { AddNotesButton } from "@/components/ContributeCTA";
import { Icon } from "@/components/ui/icons";
import {
  countNotes,
  departmentSlug,
  findDepartment,
  findSemester,
  findSubject,
  findYear,
  sameSubjectElsewhere,
  subjectPath,
  subjectSlug,
} from "@/lib/catalog";
import { isNew } from "@/lib/changelog";
import { countUsable, isGone, isUsable } from "@/lib/linkHealth";
import { deadSince } from "@/lib/linkRot";
import { reportIssueUrl } from "@/lib/site";
import { JsonLd, breadcrumbLd, courseLd } from "@/components/StructuredData";

type Params = Promise<{
  department: string;
  year: string;
  semester: string;
  subject: string;
}>;

export function generateStaticParams() {
  return departments.flatMap((department) =>
    department.years.flatMap((year) =>
      year.semesters.flatMap((semester) =>
        semester.subjects.map((subject) => ({
          department: departmentSlug(department),
          year: String(year.year),
          semester: String(semester.number),
          subject: subjectSlug(subject, semester),
        }))
      )
    )
  );
}

async function resolve(params: Params) {
  const {
    department: deptSlug,
    year: yearParam,
    semester: semesterParam,
    subject: subjectParam,
  } = await params;

  const department = findDepartment(deptSlug);
  const year = findYear(department, yearParam);
  const semester = findSemester(year, semesterParam);
  const subject = findSubject(semester, subjectParam);

  return { department, year, semester, subject };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { department, year, semester, subject } = await resolve(params);
  if (!department || !year || !semester || !subject) {
    return { title: "Subject not found" };
  }

  const title = `${subject.name}${
    subject.subject_code ? ` (${subject.subject_code})` : ""
  }`;
  const description = `${subject.notes.length} resources for ${subject.name} — ${department.name}, year ${year.year}, semester ${semester.number} at RVCE.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function SubjectPage({ params }: { params: Params }) {
  const { department, year, semester, subject } = await resolve(params);
  if (!department || !year || !semester || !subject) notFound();

  const semesterPath = `${department.link}/${year.year}/${semester.number}`;
  const path = `${semesterPath}/${subjectSlug(subject, semester)}`;
  const counts = countNotes(subject.notes);
  const siblings = semester.subjects.filter((other) => other !== subject);
  const { usable, broken } = countUsable(subject.notes);

  // When a subject's own links have died, the same course in another branch is
  // usually the fastest rescue.
  const elsewhere =
    usable === 0
      ? sameSubjectElsewhere(
          { department, year, semester, subject },
          isUsable
        ).slice(0, 4)
      : [];

  const trail = [
    { label: "Departments", href: "/" },
    { label: department.name, href: department.link },
    { label: `Year ${year.year}`, href: `${department.link}/${year.year}` },
    { label: `Semester ${semester.number}`, href: semesterPath },
    { label: subject.name },
  ];

  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumbLd(trail)} />
      <JsonLd
        data={courseLd({
          name: subject.name,
          code: subject.subject_code,
          description: `Notes, lab material and question papers for ${subject.name} at RVCE.`,
          path,
          department: department.name,
        })}
      />
      <TrackVisit
        path={path}
        title={subject.name}
        subtitle={`Sem ${semester.number}`}
      />

      <PageHeader
        eyebrow={`${department.name} · Year ${year.year} · Semester ${semester.number}`}
        title={subject.name}
        trail={trail}
      >
        <div className="flex flex-wrap items-center gap-3">
          {subject.subject_code && (
            <span className="rounded-md bg-raised px-2 py-1 font-mono text-xs uppercase tracking-wide text-fg">
              {subject.subject_code}
            </span>
          )}
          <CoverageBadges counts={counts} />
          <span className="text-sm text-muted">
            {counts.total} {counts.total === 1 ? "resource" : "resources"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <DoneToggle path={path} />
          <ShareButton
            title={`${subject.name} — KnotesNeo`}
            text={`${subject.name} notes (${department.name}, Sem ${semester.number})`}
          />
          <AddNotesButton
            label="Add a resource"
            variant="outline"
            context={{
              department: department.name,
              year: year.year,
              semester: semester.number,
              subject: subject.name,
            }}
          />
        </div>
      </PageHeader>

      <section aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="sr-only">
          Resources
        </h2>

        {subject.notes.length ? (
          <div className="card divide-y divide-line p-2">
            {subject.notes.map((note) => (
              <NoteLink
                key={`${note.title}-${note.link}`}
                note={note}
                subject={subject.name}
                path={path}
                isNew={isNew(note)}
                isGone={isGone(note)}
                deadSince={deadSince(note)}
              />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-sm text-muted">
            Nothing uploaded for this subject yet.
          </div>
        )}

        <p className="mt-3 text-xs text-muted">
          A link not opening?{" "}
          <a
            href={reportIssueUrl({ page: path })}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand hover:underline"
          >
            Report it
          </a>{" "}
          and it gets fixed.
        </p>
      </section>

      {elsewhere.length > 0 && (
        <section
          aria-labelledby="elsewhere-heading"
          className="card border-brand/30 p-5"
        >
          <h2
            id="elsewhere-heading"
            className="flex items-center gap-2 text-sm font-semibold text-fg"
          >
            <Icon name="sparkles" className="h-4 w-4 text-brand" />
            {broken > 0
              ? "These links are dead — but another branch still has this subject"
              : "This subject is also taught elsewhere"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Same course, different department. The material is usually close
            enough to revise from.
          </p>
          <ul className="mt-3 space-y-2">
            {elsewhere.map((match) => (
              <li key={subjectPath(match)}>
                <Link
                  href={subjectPath(match)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-line p-3 hover:border-brand/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-fg group-hover:text-brand">
                      {match.department.name}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {match.subject.name} · Year {match.year.year} · Sem{" "}
                      {match.semester.number}
                    </span>
                  </span>
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 shrink-0 text-brand"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {siblings.length > 0 && (
        <section aria-labelledby="siblings-heading">
          <h2
            id="siblings-heading"
            className="text-sm font-semibold uppercase tracking-widest text-muted"
          >
            Also in semester {semester.number}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {siblings.map((other) => (
              <Link
                key={other.name}
                href={`${semesterPath}/${subjectSlug(other, semester)}`}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-fg transition hover:border-brand/40 hover:text-brand"
              >
                {other.name}
              </Link>
            ))}
          </div>
          <Link
            href={`${semesterPath}/exam-prep`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <Icon name="target" className="h-4 w-4" />
            Exam prep for this semester
          </Link>
        </section>
      )}
    </div>
  );
}
