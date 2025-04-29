import { departments } from "../../data/mockData";
import { notFound } from "next/navigation";
import { use } from "react";

export default function DepartmentPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const departmentSlug = resolvedParams.department;

  // Find the department from the URL parameter
  const department = departments.find(
    (dept) => dept.link === `/${departmentSlug}`
  );

  // If department not found, show 404
  if (!department) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Department Header */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-neon-purple/20">
        <h1 className="text-3xl font-bold mb-4">{department.name}</h1>
        <p className="text-foreground/70">{department.description}</p>
      </div>

      {/* Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {department.years.map((year) => (
          <a
            key={year.year}
            href={`${department.link}/${year.year}`}
            className="block group"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 h-full border border-neon-purple/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10">
              {/* Year Header */}
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground group-hover:text-neon-purple transition-colors">
                  Year {year.year}
                </h2>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <p className="text-foreground/70">
                  {year.semesters.length} Semesters
                </p>
                <div className="flex items-center text-sm text-neon-purple">
                  <span>View details</span>
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
