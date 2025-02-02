import { Contributors } from "../data/dataTypes";

export default function ContributorCard({
  contributor,
}: {
  contributor: Contributors;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <a
            href={contributor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {contributor.name}
          </a>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
            {contributor.notes_contributed} notes
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <span className="font-medium">Department:</span>{" "}
            {contributor.department}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <span className="font-medium">Year:</span> {contributor.year}
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
          {contributor.description}
        </p>
      </div>
    </div>
  );
}
