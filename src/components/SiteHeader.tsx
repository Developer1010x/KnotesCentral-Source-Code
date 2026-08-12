"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandPalette } from "@/components/CommandPalette";
import { ShortcutsHelp } from "@/components/ShortcutsHelp";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Icon } from "@/components/ui/icons";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Departments" },
  { href: "/whats-new", label: "What's new" },
  { href: "/gaps", label: "Help needed" },
  { href: "/saved", label: "Saved" },
  { href: "/contribute", label: "Contribute" },
];

/** "g" then a letter, the convention people already know from GitHub. */
const GO_TO: Record<string, string> = {
  h: "/",
  s: "/saved",
  n: "/whats-new",
  c: "/contribute",
  g: "/gaps",
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Route change closes whatever was open.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setHelpOpen(false);
  }, [pathname]);

  useEffect(() => {
    let awaitingGo = false;

    const typing = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;
      return (
        !!element &&
        (element.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName))
      );
    };

    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }

      // Never hijack a key while someone is filling in a form.
      if (event.metaKey || event.ctrlKey || event.altKey || typing(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();

      if (awaitingGo && GO_TO[key]) {
        event.preventDefault();
        awaitingGo = false;
        router.push(GO_TO[key]);
        return;
      }
      awaitingGo = key === "g";

      if (key === "/") {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "?") {
        event.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-contrast"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur">
        <div className="container flex h-16 items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-contrast">
              <Icon name="book" className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-fg">
                {SITE.name}
              </span>
              <span className="hidden text-[11px] text-muted sm:block">
                RVCE study resources
              </span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(href)
                    ? "bg-brand-soft text-brand"
                    : "text-muted hover:bg-raised hover:text-fg"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted transition hover:border-brand/40 hover:text-fg"
              aria-label="Search subjects"
            >
              <Icon name="search" className="h-4 w-4" />
              <span className="hidden lg:inline">Search subjects</span>
              <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] font-medium lg:inline">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-muted hover:bg-raised hover:text-fg md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            className="border-t border-line bg-surface md:hidden"
          >
            <div className="container flex flex-col py-2">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive(href) ? "text-brand" : "text-fg"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
