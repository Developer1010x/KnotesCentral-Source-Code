"use client";
import { departments } from "../../data/mockData";
import { useState, useMemo } from "react";

interface SearchResult {
  department: string;
  departmentLink: string;
  year: number;
  semester: number;
  subject: {
    name: string;
    subject_code: string;
    notes: {
      title: string;
      type: string;
      link: string;
    }[];
  };
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    departments.forEach((dept) => {
      dept.years.forEach((year) => {
        year.semesters.forEach((semester) => {
          semester.subjects.forEach((subject) => {
            if (
              subject.subject_code.toLowerCase().includes(query) ||
              subject.name.toLowerCase().includes(query)
            ) {
              results.push({
                department: dept.name,
                departmentLink: dept.link,
                year: year.year,
                semester: semester.number,
                subject: subject,
              });
            }
          });
        });
      });
    });

    return results;
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-neon-purple/20">
        <h1 className="text-3xl font-bold mb-4">Search Subjects</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by subject code or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-neon-purple/20 
              backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/50 text-foreground
              placeholder-foreground/50"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {searchResults.map((result, index) => (
          <div
            key={`${result.subject.subject_code}-${index}`}
            className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 h-full border border-neon-purple/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10 group"
          >
            {/* Subject Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {result.subject.name}
                    </h2>
                    <span className="text-sm font-medium text-neon-purple">
                      {result.subject.subject_code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="text-sm text-foreground/70">
                <a
                  href={`${result.departmentLink}/${result.year}/${result.semester}`}
                  className="hover:text-neon-purple"
                >
                  {result.department} • Year {result.year} • Semester{" "}
                  {result.semester}
                </a>
              </div>

              {/* Notes Preview */}
              <div className="grid gap-2">
                {result.subject.notes.map((note) => (
                  <a
                    key={note.title}
                    href={note.link}
                    className="block bg-black/5 dark:bg-white/5 rounded-lg p-3 hover:bg-neon-purple/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {note.type === "theory" && "📚"}
                        {note.type === "lab" && "🔬"}
                        {note.type === "question-paper" && "📝"}
                      </span>
                      <div>
                        <h3 className="font-medium text-foreground group-hover:text-neon-purple transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-xs text-foreground/70 capitalize">
                          {note.type.replace("-", " ")}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-foreground/70">
            No subjects found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
