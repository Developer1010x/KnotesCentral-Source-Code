import { contributors } from "../../data/mockData";
import ContributorCard from "../../components/contributorCard";

export default function ContributorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Contributors
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributors.map((contributor, index) => (
          <ContributorCard key={index} contributor={contributor} />
        ))}
      </div>
    </div>
  );
}
