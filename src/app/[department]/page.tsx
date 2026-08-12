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
  departmentNotes,
  departmentSlug,
  findDepartment,
  subjectCount,
  yearNotes,
} from "@/lib/catalog";

export function generateStaticParams() {
  return departments.map((department) => ({
    department: departmentSlug(department),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string }>;
}): Promise<Metadata> {
  const { department: slug } = await params;
  const department = findDepartment(slug);
  if (!department) return { title: "Department not found" };

  return {
    title: department.name,
    description: department.description,
    openGraph: { title: department.name, description: department.description },
  };
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department: slug } = await params;
  const department = findDepartment(slug);

  if (!department) notFound();

  const counts = countNotes(departmentNotes(department));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Department"
        title={department.name}
        description={department.description}
        trail={[{ label: "Departments", href: "/" }, { label: department.name }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <CoverageBadges counts={counts} />
          <span className="text-sm text-muted">
            {subjectCount(department)} subjects · {counts.total} resources
          </span>
        </div>
      </PageHeader>

      {department.years.length ? (
        <CardGrid>
          {department.years.map((year) => (
            <TileLink
              key={year.year}
              href={`${department.link}/${year.year}`}
              icon="calendar"
              eyebrow="Year"
              title={`Year ${year.year}`}
              meta={`${year.semesters.length} ${
                year.semesters.length === 1 ? "semester" : "semesters"
              }`}
            >
              <CoverageBadges counts={countNotes(yearNotes(year))} />
            </TileLink>
          ))}
        </CardGrid>
      ) : (
        <EmptyState
          context={{ department: department.name }}
          title="Nothing uploaded for this department yet"
          description="No years have been added here so far. If you have notes for this branch, adding them takes a minute."
        />
      )}
    </div>
  );
}
