import { departments } from "../data/mockData";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Welcome to Knotes Central
        </h1>
        <p className="text-lg text-foreground/70">
          Choose your department to access study materials
        </p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((department) => (
          <a
            key={department.name}
            href={department.link}
            className="group block"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 h-full border border-neon-purple/20 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-neon-purple/10 hover:border-neon-purple/40">
              <div className="flex items-center space-x-4 mb-4">
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
                <h2 className="text-2xl font-bold text-foreground group-hover:text-neon-purple transition-colors">
                  {department.name}
                </h2>
              </div>
              <p className="text-foreground/70 line-clamp-2">
                {department.description}
              </p>
              <div className="mt-4 flex items-center text-sm text-neon-purple">
                <span>Browse resources</span>
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
          </a>
        ))}
      </div>
    </div>
  );
}
