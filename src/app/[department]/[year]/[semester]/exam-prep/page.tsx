import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { departments } from "@/data/departments";
import type { Note, NoteType } from "@/data/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoteLink } from "@/components/NoteLink";
import { ShareButton } from "@/components/ShareButton";
import { SemesterSwitcher } from "@/components/SemesterSwitcher";
import { CopyLinks } from "@/components/CopyLinks";
import { SemesterProgress } from "@/components/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/icons";
import {
  countNotes,
  departmentSlug,
  findDepartment,
  findSemester,
  findYear,
  semesterNotes,
  subjectSlug,
} from "@/lib/catalog";
import { isNew } from "@/lib/changelog";
import { isGone } from "@/lib/linkHealth";
import { NOTE_TYPE_ORDER, noteTypeMeta } from "@/lib/noteTypes";

type Params = Promise<{ department: string; year: string; semester: string }>;

export function generateStaticParams() {
  return departments.flatMap((department) =>
    department.years.flatMap((year) =>
      year.semesters.map((semester) => ({
        department: departmentSlug(department),
        year: String(year.year),
        semester: String(semester.number),
      }))
    )
  );
}

async function resolve(params: Params) {
  const {
    department: deptSlug,
    year: yearParam,
    semester: semesterParam,
  } = await params;
  const department = findDepartment(deptSlug);
  const year = findYear(department, yearParam);
  const semester = findSemester(year, semesterParam);
  return { department, year, semester };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { department, year, semester } = await resolve(params);
  if (!department || !year || !semester) return { title: "Not found" };

  return {
    title: `Exam prep · ${department.name} Semester ${semester.number}`,
    description: `Every note, lab manual and question paper for semester ${semester.number} of ${department.name}, grouped for revision.`,
  };
}

export default async function ExamPrepPage({ params }: { params: Params }) {
  const { department, year, semester } = await resolve(params);
  if (!department || !year || !semester) notFound();

  const semesterPath = `${department.link}/${year.year}/${semester.number}`;
  const counts = countNotes(semesterNotes(semester));

  // Everything in the semester, regrouped by what it is rather than by subject.
  const byType = new Map<NoteType, Array<{ note: Note; subject: string; path: string }>>();
  for (const subject of semester.subjects) {
    const path = `${semesterPath}/${subjectSlug(subject, semester)}`;
    for (const note of subject.notes) {
      const bucket = byType.get(note.type) ?? [];
      bucket.push({ note, subject: subject.name, path });
      byType.set(note.type, bucket);
    }
  }

  const subjectPaths = semester.subjects.map(
    (subject) => `${semesterPath}/${subjectSlug(subject, semester)}`
  );

  const groups = NOTE_TYPE_ORDER.filter((type) => byType.get(type)?.length);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${department.name} · Year ${year.year}`}
        title={`Semester ${semester.number} exam prep`}
        description="Everything for this semester in one list, grouped by what it is — no clicking through subjects the night before an exam."
        trail={[
          { label: "Departments", href: "/" },
          { label: department.name, href: department.link },
          { label: `Year ${year.year}`, href: `${department.link}/${year.year}` },
          { label: `Semester ${semester.number}`, href: semesterPath },
          { label: "Exam prep" },
        ]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <ShareButton
            title={`${department.name} Sem ${semester.number} exam prep`}
            text={`Everything for ${department.name} semester ${semester.number}`}
          />
          <CopyLinks
            items={semesterNotes(semester).map((note) => ({
              title: note.title,
              link: note.link,
            }))}
          />
          <Link
            href={semesterPath}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
          >
            <Icon name="layers" className="h-4 w-4" />
            Browse by subject
          </Link>
        </div>

        <div className="mt-4">
          <SemesterSwitcher
            departmentLink={department.link}
            years={department.years.map((y) => ({
              year: y.year,
              semesters: y.semesters.map((s) => s.number),
            }))}
            current={{ year: year.year, semester: semester.number }}
          />
        </div>
      </PageHeader>

      <SemesterProgress paths={subjectPaths} />

      {counts.total === 0 ? (
        <EmptyState
          context={{
            department: department.name,
            year: year.year,
            semester: semester.number,
          }}
          title="Nothing to revise from yet"
          description="No resources have been added for this semester. If you have notes from it, adding them takes a minute."
        />
      ) : (
        groups.map((type) => {
          const meta = noteTypeMeta(type);
          const items = byType.get(type) ?? [];

          return (
            <section key={type} aria-labelledby={`group-${type}`}>
              <div className="mb-3 flex items-center gap-2 border-b border-line pb-2">
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                <h2 id={`group-${type}`} className="text-base font-semibold text-fg">
                  {meta.label}
                </h2>
                <span className="text-sm text-muted">{items.length}</span>
              </div>

              <div className="card divide-y divide-line p-2">
                {items.map(({ note, subject, path }) => (
                  <div key={`${note.title}-${note.link}`}>
                    <NoteLink
                      note={note}
                      subject={subject}
                      path={path}
                      isNew={isNew(note)}
                isGone={isGone(note)}
                    />
                    <Link
                      href={path}
                      className="-mt-1 mb-2 ml-11 inline-block text-xs text-muted hover:text-brand"
                    >
                      {subject}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
