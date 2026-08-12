import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { departments } from "@/data/departments";
import { CardGrid } from "@/components/ui/Card";
import { CoverageBadges } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubjectCard } from "@/components/SubjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrackVisit } from "@/components/RecentlyViewed";
import { SemesterProgress } from "@/components/Progress";
import { ShareButton } from "@/components/ShareButton";
import { SemesterSwitcher } from "@/components/SemesterSwitcher";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { ContributeBanner } from "@/components/ContributeCTA";
import {
  countNotes,
  departmentSlug,
  findDepartment,
  findSemester,
  findYear,
  semesterNotes,
  subjectSlug,
} from "@/lib/catalog";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string; year: string; semester: string }>;
}): Promise<Metadata> {
  const {
    department: slug,
    year: yearParam,
    semester: semesterParam,
  } = await params;
  const department = findDepartment(slug);
  const year = findYear(department, yearParam);
  const semester = findSemester(year, semesterParam);
  if (!department || !year || !semester) return { title: "Not found" };

  const subjects = semester.subjects.map((s) => s.name).join(", ");

  return {
    title: `${department.name} · Semester ${semester.number}`,
    description: `Notes, lab material and question papers for semester ${semester.number}: ${subjects}.`,
  };
}

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ department: string; year: string; semester: string }>;
}) {
  const {
    department: slug,
    year: yearParam,
    semester: semesterParam,
  } = await params;

  const department = findDepartment(slug);
  const year = findYear(department, yearParam);
  const semester = findSemester(year, semesterParam);

  if (!department || !year || !semester) notFound();

  const counts = countNotes(semesterNotes(semester));
  const semesterPath = `${department.link}/${year.year}/${semester.number}`;
  const subjectPaths = semester.subjects.map(
    (subject) => `${semesterPath}/${subjectSlug(subject, semester)}`
  );

  return (
    <div className="space-y-8">
      <TrackVisit
        path={`${department.link}/${year.year}/${semester.number}`}
        title={`Semester ${semester.number}`}
        subtitle={department.name}
      />

      <PageHeader
        eyebrow={`${department.name} · Year ${year.year}`}
        title={`Semester ${semester.number}`}
        trail={[
          { label: "Departments", href: "/" },
          { label: department.name, href: department.link },
          {
            label: `Year ${year.year}`,
            href: `${department.link}/${year.year}`,
          },
          { label: `Semester ${semester.number}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <CoverageBadges counts={counts} />
          <span className="text-sm text-muted">
            {semester.subjects.length} subjects · {counts.total} resources
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`${semesterPath}/exam-prep`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-contrast hover:opacity-90"
          >
            <Icon name="target" className="h-4 w-4" />
            Exam prep view
          </Link>
          <ShareButton
            title={`${department.name} Semester ${semester.number}`}
            text={`Notes for ${department.name}, semester ${semester.number}`}
          />
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

      {semester.subjects.length ? (
        <CardGrid>
          {semester.subjects.map((subject) => (
            <SubjectCard
              key={`${subject.subject_code}-${subject.name}`}
              subject={subject}
              semester={semester}
              semesterPath={`${department.link}/${year.year}/${semester.number}`}
            />
          ))}
        </CardGrid>
      ) : (
        <EmptyState
          context={{
            department: department.name,
            year: year.year,
            semester: semester.number,
          }}
          title="No subjects listed for this semester"
          description="Nobody has added this semester's subjects yet. Adding them helps everyone in your batch and the ones after."
        />
      )}

      <ContributeBanner
        context={{
          department: department.name,
          year: year.year,
          semester: semester.number,
        }}
      />
    </div>
  );
}
