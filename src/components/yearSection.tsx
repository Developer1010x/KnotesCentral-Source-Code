import { Year } from "../data/dataTypes";
import SemesterSection from "../components/semesterSection";

export default function YearSection({ year }: { year: Year }) {
  return (
    <div className="mb-6 last:mb-0 border-l-2 border-blue-200 dark:border-gray-600 pl-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
        <span className="mr-2">📚</span>
        Year {year.year}
      </h3>
      {year.semesters.map((semester) => (
        <SemesterSection key={semester.number} semester={semester} />
      ))}
    </div>
  );
}
