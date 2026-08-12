import { Icon } from "@/components/ui/icons";
import { addNotesIssueUrl } from "@/lib/site";

/**
 * The one contribution affordance used site-wide. Context is passed through to
 * the GitHub issue form so the fields arrive prefilled and juniors only have to
 * paste a link.
 */
export function AddNotesButton({
  context,
  label = "Add notes",
  variant = "solid",
}: {
  context?: Parameters<typeof addNotesIssueUrl>[0];
  label?: string;
  variant?: "solid" | "outline";
}) {
  const styles =
    variant === "solid"
      ? "bg-brand text-brand-contrast hover:opacity-90"
      : "border border-line bg-surface text-fg hover:border-brand/40 hover:text-brand";

  return (
    <a
      href={addNotesIssueUrl(context)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold ${styles}`}
    >
      {label}
      <Icon name="external" className="h-4 w-4" />
    </a>
  );
}

export function ContributeBanner({
  context,
}: {
  context?: Parameters<typeof addNotesIssueUrl>[0];
}) {
  return (
    <section className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-fg">
          Something missing here?
        </h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          Adding notes takes about a minute: paste your Drive link into a short
          form on GitHub. No Git knowledge, no waiting on anyone.
        </p>
      </div>
      <AddNotesButton context={context} />
    </section>
  );
}
