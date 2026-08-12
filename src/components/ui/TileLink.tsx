import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

/**
 * Navigational tile used by the department, year and semester listings.
 * The whole card is one link target — easier to hit on a phone than a
 * "view details" affordance in the corner.
 */
export function TileLink({
  href,
  icon,
  eyebrow,
  title,
  meta,
  children,
}: {
  href: string;
  icon: IconName;
  eyebrow?: string;
  title: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <Link href={href} className="group block rounded-card">
      <article className="card-interactive flex h-full flex-col p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-brand-contrast">
            <Icon name={icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {eyebrow}
              </p>
            )}
            <h2 className="text-base font-semibold leading-snug text-fg group-hover:text-brand">
              {title}
            </h2>
            {meta && <p className="mt-0.5 text-sm text-muted">{meta}</p>}
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-brand">
          <span>Open</span>
          <Icon
            name="arrowRight"
            className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </div>
      </article>
    </Link>
  );
}
