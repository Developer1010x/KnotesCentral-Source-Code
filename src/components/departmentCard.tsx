import { Department } from "../data/dataTypes";
import YearSection from "../components/yearSection";

export default function DepartmentCard({
  department,
}: {
  department: Department;
}) {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-neon-purple/20 backdrop-blur-sm">
      <div className="p-6 pb-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 dark:from-neon-blue/5 dark:to-neon-purple/5">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {department.name}
        </h2>
        <p className="text-foreground/70 text-sm line-clamp-2">
          {department.description}
        </p>
      </div>

      <div className="p-4 space-y-4">
        {department.years?.map((year) => (
          <YearSection key={year.year} year={year} />
        ))}
      </div>
    </div>
  );
}
