// Check if we're in the browser
const isBrowser = typeof window !== "undefined";

// Get theme from localStorage or system preference
export function getInitialTheme(): string {
  // Always return dark for server-side rendering
  if (!isBrowser) return "dark";

  try {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    // Fall back to system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  } catch {
    return "dark";
  }
}

// Set theme in localStorage and update document class
export function setTheme(theme: string) {
  if (!isBrowser) return;

  try {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    console.log("Failed to set theme");
  }
}
