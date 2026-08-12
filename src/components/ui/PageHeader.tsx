import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {trail.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && (
              <Icon
                name="chevronRight"
                className="h-3.5 w-3.5 shrink-0 text-muted/60"
              />
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="rounded px-1 py-0.5 hover:text-brand"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="px-1 py-0.5 font-medium text-fg" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Opens every listing page: breadcrumb, title, blurb, optional badge strip. */
export function PageHeader({
  title,
  description,
  trail,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  trail?: Crumb[];
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line pb-6">
      {trail && <Breadcrumb trail={trail} />}
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 text-display-sm font-bold text-fg">{title}</h1>
      {description && (
        <p className="mt-3 max-w-prose text-[0.975rem] leading-7 text-muted">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}
