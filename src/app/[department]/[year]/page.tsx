import { departments } from "../../../data/mockData";
import { notFound } from "next/navigation";
import { use } from "react";

export default function YearPage({
  params,
}: {
  params: Promise<{ department: string; year: string }>;
}) {
  const resolvedParams = use(params);
  
  const department = departments.find(
    (dept) => dept.link === `/${resolvedParams.department}`
  );
  const year = department?.years.find(
    (y) => y.year === parseInt(resolvedParams.year)
  );

  if (!department || !year) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-neon-purple/20">
        <div className="flex items-center gap-2 text-sm text-foreground/70 mb-4">
          <a href={department.link} className="hover:text-neon-purple">
            {department.name}
          </a>
          <span>→</span>
          <span>Year {year.year}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Year {year.year}</h1>
      </div>

      {/* Semesters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {year.semesters.map((semester) => (
          <a
            key={semester.number}
            href={`${department.link}/${year.year}/${semester.number}`}
            className="block group"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 h-full border border-neon-purple/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10">
              {/* Semester Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-neon-blue to-neon-purple p-3 rounded-lg">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground group-hover:text-neon-purple transition-colors">
                  Semester {semester.number}
                </h2>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <p className="text-foreground/70">
                  {semester.subjects.length} Subjects
                </p>
                <div className="flex items-center text-sm text-neon-purple">
                  <span>View subjects</span>
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 