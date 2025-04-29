import { Semester } from "../data/dataTypes";
import SubjectSection from "../components/subjectSection";

export default function SemesterSection({ semester }: { semester: Semester }) {
  return (
    <div className="mb-4 last:mb-0 bg-gray-50 dark:bg-gray-700/20 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">
        Semester {semester.number}
      </h4>
      {semester.subjects.map((subject) => (
        <SubjectSection key={subject.name} subject={subject} />
      ))}
    </div>
  );
}
