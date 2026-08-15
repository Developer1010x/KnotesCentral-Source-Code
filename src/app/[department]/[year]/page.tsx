import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { departments } from "@/data/departments";
import { CardGrid } from "@/components/ui/Card";
import { CoverageBadges } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { TileLink } from "@/components/ui/TileLink";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  countNotes,
  departmentSlug,
  findDepartment,
  findYear,
  semesterNotes,
  yearNotes,
} from "@/lib/catalog";

export function generateStaticParams() {
  return departments.flatMap((department) =>
    department.years.map((year) => ({
      department: departmentSlug(department),
      year: String(year.year),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string; year: string }>;
}): Promise<Metadata> {
  const { department: slug, year: yearParam } = await params;
  const department = findDepartment(slug);
  const year = findYear(department, yearParam);
  if (!department || !year) return { title: "Not found" };

  return {
    title: `${department.name} · Year ${year.year}`,
    description: `Semesters and subjects for year ${year.year} of ${department.name} at RVCE.`,
  };
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ department: string; year: string }>;
}) {
  const { department: slug, year: yearParam } = await params;
  const department = findDepartment(slug);
  const year = findYear(department, yearParam);

  if (!department || !year) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={department.name}
        title={`Year ${year.year}`}
        trail={[
          { label: "Departments", href: "/" },
          { label: department.name, href: department.link },
          { label: `Year ${year.year}` },
        ]}
      >
        <CoverageBadges counts={countNotes(yearNotes(year))} />
      </PageHeader>

      {year.semesters.length ? (
        <CardGrid>
          {year.semesters.map((semester) => (
            <TileLink
              key={semester.number}
              href={`${department.link}/${year.year}/${semester.number}`}
              icon="layers"
              eyebrow="Semester"
              title={`Semester ${semester.number}`}
              meta={`${semester.subjects.length} ${
                semester.subjects.length === 1 ? "subject" : "subjects"
              }`}
            >
              <CoverageBadges counts={countNotes(semesterNotes(semester))} />
            </TileLink>
          ))}
        </CardGrid>
      ) : (
        <EmptyState
          context={{ department: department.name, year: year.year }}
          title="No semesters here yet"
          description="This year has not been filled in. If you are in it, you are exactly the person who can fix that."
        />
      )}
    </div>
  );
}
