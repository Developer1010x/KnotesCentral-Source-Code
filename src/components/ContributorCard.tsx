import type { Contributor } from "@/data/types";
import { Icon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/Badge";

/** Initials avatar — no photos to host, still gives each card an anchor. */
function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand"
    >
      {initials || "?"}
    </span>
  );
}

export default function ContributorCard({
  contributor,
}: {
  contributor: Contributor;
}) {
  const { name, link, contribution, description, department, year } =
    contributor;

  return (
    <article className="card-interactive flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-fg">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-brand"
              >
                {name}
                <Icon name="external" className="h-3.5 w-3.5 text-muted" />
              </a>
            ) : (
              name
            )}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {department}
            {year ? ` · Batch ${year}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <Badge className="bg-brand-soft text-brand">{contribution}</Badge>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      )}
    </article>
  );
}
