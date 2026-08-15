import Link from "next/link";
import { Icon, type IconName } from "./icons";
import { addNotesIssueUrl } from "@/lib/site";

/**
 * Never show juniors a blank grid — say what is missing and how to fix it.
 * The default action prefills the GitHub form with wherever they were.
 */
export function EmptyState({
  icon = "inbox",
  title,
  description,
  context,
  action,
}: {
  icon?: IconName;
  title: string;
  description: string;
  context?: Parameters<typeof addNotesIssueUrl>[0];
  action?: { label: string; href: string; external?: boolean };
}) {
  const cta = action ?? {
    label: "Add notes for this",
    href: addNotesIssueUrl(context),
    external: true,
  };

  const className =
    "mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast hover:opacity-90";

  return (
    <div className="card px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {cta.external ? (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {cta.label}
          <Icon name="external" className="h-4 w-4" />
        </a>
      ) : (
        <Link href={cta.href} className={className}>
          {cta.label}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
