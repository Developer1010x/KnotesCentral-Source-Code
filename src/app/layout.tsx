import { Inter } from "next/font/google";
import "./globals.css"; // Make sure this import is present
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// This script runs before React hydration to prevent flash of wrong theme
// It causes a hydration warning in development, which is expected and can be ignored
const themeInitScript = `
  (function() {
    const theme = localStorage.getItem('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList[theme === 'dark' ? 'add' : 'remove']('dark');
  })()
`;

// Add this with other icon components at the top
const SearchIcon = () => (
  <svg
    className="w-4 h-4"
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
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="color-scheme" content="dark light" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <header className="relative z-10 backdrop-blur-md border-b border-[var(--card-border)]">
            {/* Main Header */}
            <div className="container py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight neon-text">
                  <Link
                    href="/"
                    className="hover:text-[var(--neon-purple)] transition-colors"
                  >
                    Knotes Central
                  </Link>
                </h1>
              </div>
              <p className="mt-2 text-sm text-opacity-80">
                Comprehensive collection of academic resources for RVCE
              </p>
            </div>

            {/* Navigation Bar */}
            <nav className="border-t border-[var(--card-border)]">
              <div className="container">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 md:py-0 space-y-4 md:space-y-0">
                  {/* Main Navigation */}
                  <div className="flex flex-col md:flex-row gap-2">
                    <Link
                      href="/"
                      className="nav-link hover:text-[var(--neon-blue)]"
                    >
                      Home
                    </Link>
                    <Link
                      href="/contributors"
                      className="nav-link hover:text-[var(--neon-blue)]"
                    >
                      Contributors
                    </Link>
                  </div>

                  {/* Secondary Navigation */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <Link
                      href="/about"
                      className="nav-link hover:text-[var(--neon-purple)]"
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="nav-link hover:text-[var(--neon-purple)]"
                    >
                      Contact
                    </Link>
                    <Link
                      href="/search"
                      className="nav-link hover:text-[var(--neon-green)] flex items-center gap-1"
                    >
                      <SearchIcon />
                      <span>Search</span>
                    </Link>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-grow container py-8">{children}</main>

          <footer className="mt-auto border-t border-[var(--card-border)] py-6">
            <div className="container text-center text-sm">
              <p className="mb-2">
                © 2025 Knotes Central. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/about" className="hover:text-[var(--neon-purple)]">
                  About
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-[var(--neon-purple)]"
                >
                  Contact
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-[var(--neon-purple)]"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
