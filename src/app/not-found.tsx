import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { reportIssueUrl } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        404
      </p>
      <h1 className="mt-2 text-display-sm font-bold text-fg">
        That page is not here
      </h1>
      <p className="mt-3 text-[0.975rem] leading-7 text-muted">
        The department, year or semester you asked for does not exist — or it
        has not been added yet. Search for the subject instead; it may live
        under a different branch.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-contrast hover:opacity-90"
        >
          <Icon name="search" className="h-4 w-4" />
          Search subjects
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
        >
          All departments
        </Link>
      </div>

      <p className="mt-6 text-sm text-muted">
        Landed here from a link on the site?{" "}
        <a
          href={reportIssueUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand hover:underline"
        >
          Tell us
        </a>
        .
      </p>
    </div>
  );
}
