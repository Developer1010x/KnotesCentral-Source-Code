import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { CONTACT_EMAIL, REDDIT, REPO_URL, SITE } from "@/lib/site";
import { AddNotesButton } from "@/components/ContributeCTA";

const BROWSE = [
  { href: "/", label: "All departments" },
  { href: "/whats-new", label: "What's new" },
  { href: "/gaps", label: "Help needed" },
  { href: "/saved", label: "Saved on this device" },
  { href: "/contribute", label: "Contribute notes" },
  { href: "/search", label: "Search subjects" },
  { href: "/contributors", label: "Contributors" },
];

const ABOUT = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy policy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-contrast">
              <Icon name="book" className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold text-fg">{SITE.name}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            {SITE.tagline} Built by RVCE students, kept alive by the batches
            that follow. <em>{SITE.motto}</em>
          </p>
          <div className="mt-4">
            <AddNotesButton label="Add your notes" />
          </div>
        </div>

        <nav aria-label="Browse">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-fg">
            Browse
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {BROWSE.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-muted hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="About">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-fg">
            About
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {ABOUT.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-muted hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-muted hover:text-brand"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted hover:text-brand"
              >
                <Icon name="github" className="h-3.5 w-3.5" />
                Source on GitHub
              </a>
            </li>
            <li>
              <a
                href={REDDIT.knotes}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-brand"
              >
                r/KnotesCentral
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="container py-5 text-xs text-muted">
          © {new Date().getFullYear()} {SITE.name}. Material is shared for
          educational use by the RVCE community.
        </p>
      </div>
    </footer>
  );
}
