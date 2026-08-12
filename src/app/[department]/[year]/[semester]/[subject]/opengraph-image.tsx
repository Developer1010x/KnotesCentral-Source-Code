import { ImageResponse } from "next/og";
import { departments } from "@/data/departments";
import {
  countNotes,
  departmentSlug,
  subjectSlug,
  findDepartment,
  findSemester,
  findSubject,
  findYear,
} from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const alt = "Subject on Knotes Central";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

/**
 * Per-subject share card: what a WhatsApp link preview shows when a junior
 * forwards "DSA notes" into a batch group.
 */
export default async function Image({
  params,
}: {
  params: Promise<{
    department: string;
    year: string;
    semester: string;
    subject: string;
  }>;
}) {
  const { department: deptSlug, year: y, semester: s, subject: sub } = await params;
  const department = findDepartment(deptSlug);
  const year = findYear(department, y);
  const semester = findSemester(year, s);
  const subject = findSubject(semester, sub);

  const counts = subject ? countNotes(subject.notes) : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020617",
          color: "#f1f5f9",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            K
          </div>
          <div style={{ fontSize: 26, color: "#94a3b8" }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 24, color: "#818cf8", letterSpacing: 2 }}>
            {(department?.name ?? "RVCE").toUpperCase()}
          </div>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.1 }}>
            {subject?.name ?? "Subject"}
          </div>
          <div style={{ fontSize: 28, color: "#94a3b8", display: "flex", gap: 24 }}>
            {subject?.subject_code ? <div style={{ display: "flex" }}>{subject.subject_code}</div> : null}
            <div style={{ display: "flex" }}>Year {year?.year ?? "?"}</div>
            <div style={{ display: "flex" }}>Semester {semester?.number ?? "?"}</div>
          </div>
        </div>

        <div style={{ fontSize: 30, color: "#f1f5f9", display: "flex" }}>
          {counts?.total ?? 0} resources · notes, labs and papers
        </div>
      </div>
    ),
    size
  );
}
