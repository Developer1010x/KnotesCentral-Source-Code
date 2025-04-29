'use client';
import { departments } from "../../../../data/mockData";
import { notFound } from "next/navigation";
import { use } from "react";

export default function SemesterPage({
  params,
}: {
  params: Promise<{ department: string; year: string; semester: string }>;
}) {
  const resolvedParams = use(params);
  
  const department = departments.find(
    (dept) => dept.link === `/${resolvedParams.department}`
  );
  const year = department?.years.find(
    (y) => y.year === parseInt(resolvedParams.year)
  );
  const semester = year?.semesters.find(
    (s) => s.number === parseInt(resolvedParams.semester)
  );

  if (!department || !year || !semester) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header with Breadcrumb */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-neon-purple/20">
        <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4">
          <a href={department.link} className="hover:text-[var(--neon-purple)]">
            {department.name}
          </a>
          <span>→</span>
          <a
            href={`${department.link}/${year.year}`}
            className="hover:text-[var(--neon-purple)]"
          >
            Year {year.year}
          </a>
          <span>→</span>
          <span>Semester {semester.number}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Semester {semester.number}
        </h1>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {semester.subjects.map((subject) => (
          <div
            key={subject.name}
            className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 h-full border border-neon-purple/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10 group"
          >
            {/* Subject Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {subject.name}
                  </h2>
                  <span className="text-sm font-medium text-[var(--neon-purple)]">
                    {subject.subject_code}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="grid gap-3">
              {subject.notes.map((note) => (
                <a
                  key={note.title}
                  href={note.link}
                  className="block bg-black/5 dark:bg-white/5 rounded-lg p-4 hover:bg-[var(--neon-purple)]/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {note.type === "theory" && "📚"}
                      {note.type === "lab" && "🔬"}
                      {note.type === "question-paper" && "📝"}
                    </span>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-[var(--neon-purple)] transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-sm text-foreground/70 capitalize">
                        {note.type.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 