import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/icons";
import { AddNotesButton } from "@/components/ContributeCTA";
import { catalogStats, subjectsNeedingHelp } from "@/lib/catalog";
import { isUsable } from "@/lib/linkHealth";
import {
  rotByDepartment,
  rotByHost,
  rotSummary,
  runs,
  type RotSlice,
  type RunRecord,
} from "@/lib/linkRot";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Link rot report",
  description:
    "How much of KnotesNeo's catalog has disappeared, where it was hosted, and how the damage has moved between checks.",
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const percent = (share: number) => `${Math.round(share * 100)}%`;

function Stat({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-line bg-surface px-4 py-3">
      <p className="text-2xl font-bold tabular-nums text-fg">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

/**
 * One row of the rot bars. The bar is decoration — the same numbers are in the
 * text either side of it, so nothing depends on colour or on seeing the bar.
 */
function RotBar({ slice }: { slice: RotSlice }) {
  const alive = slice.total - slice.dead;

  return (
    <li className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-3 py-1.5 sm:grid-cols-[minmax(0,16rem)_1fr_auto] sm:gap-4">
      <span className="truncate text-sm text-fg" title={slice.label}>
        {slice.label}
      </span>

      <span
        className="flex h-2.5 overflow-hidden rounded-full bg-raised"
        role="img"
        aria-label={`${slice.dead} of ${slice.total} dead`}
      >
        <span
          className="bg-paper"
          style={{ width: `${(slice.dead / slice.total) * 100}%` }}
        />
        <span
          className="bg-lab/60"
          style={{ width: `${(alive / slice.total) * 100}%` }}
        />
      </span>

      <span className="whitespace-nowrap text-xs tabular-nums text-muted">
        <span className="font-semibold text-fg">{slice.dead}</span> of{" "}
        {slice.total} · {percent(slice.share)}
      </span>
    </li>
  );
}

function RunRow({ run, previous }: { run: RunRecord; previous?: RunRecord }) {
  const change = previous ? run.gone - previous.gone : 0;

  return (
    <tr className="border-t border-line">
      <td className="py-2.5 pr-4 text-sm text-fg">
        {DATE.format(new Date(run.checkedAt))}
      </td>
      <td className="py-2.5 pr-4 text-sm tabular-nums text-muted">
        {run.checked ?? "—"}
      </td>
      <td className="py-2.5 pr-4 text-sm font-semibold tabular-nums text-fg">
        {run.gone}
      </td>
      <td className="py-2.5 pr-4 text-sm tabular-nums text-muted">
        {!previous ? (
          "first check"
        ) : change === 0 ? (
          "no change"
        ) : (
          <span className={change > 0 ? "text-paper" : "text-lab"}>
            {change > 0 ? `+${change}` : change}
          </span>
        )}
      </td>
      <td className="py-2.5 text-xs text-muted">
        {run.seeded
          ? "recovered from the first saved snapshot"
          : run.byStatus
            ? Object.entries(run.byStatus)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => `${count} ${status}`)
                .join(" · ")
            : ""}
      </td>
    </tr>
  );
}

export default function RotPage() {
  const summary = rotSummary();
  const hosts = rotByHost();
  const departments = rotByDepartment();
  const checks = runs();
  const stats = catalogStats();
  const empty = subjectsNeedingHelp(isUsable).length;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Link rot"
        title="What the catalog is losing, and how fast"
        description={`${SITE.name} links to material students uploaded to their own accounts. RVCE purges those accounts after graduation, so the catalog decays on its own. A checker runs weekly, records what it finds instead of overwriting the last result, and this is the record.`}
        trail={[{ label: "Departments", href: "/" }, { label: "Link rot" }]}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={String(summary.links)} label="Links tracked" />
          <Stat
            value={String(summary.dead)}
            label="Confirmed dead"
            hint={`${percent(summary.share)} of the catalog`}
          />
          <Stat
            value={`${empty}`}
            label="Subjects with nothing"
            hint={`of ${stats.subjects} in total`}
          />
          <Stat
            value={String(summary.checks)}
            label="Checks recorded"
            hint={
              summary.firstCheck
                ? `since ${DATE.format(new Date(summary.firstCheck))}`
                : undefined
            }
          />
        </div>
      </PageHeader>

      <section aria-labelledby="hosts-heading">
        <h2 id="hosts-heading" className="text-lg font-semibold text-fg">
          Where the material lives, and what survives there
        </h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          This is the whole argument for re-uploading anything you still have.
          A Drive folder belongs to one student and disappears with their
          account; a public repository outlives everyone who touched it.
        </p>

        <ul className="mt-4 card divide-y divide-line p-4">
          {hosts.map((host) => (
            <RotBar key={host.key} slice={host} />
          ))}
        </ul>

        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-paper" /> dead
          <span className="ml-3 h-2.5 w-2.5 rounded-full bg-lab/60" /> still
          working (including folders that ask for an RVCE login)
        </p>
      </section>

      <section aria-labelledby="departments-heading">
        <h2 id="departments-heading" className="text-lg font-semibold text-fg">
          Rot by department
        </h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          Worst first, counted in broken cards rather than distinct links — a
          folder shared by two branches is a dead end in both. A department near
          the top is not badly maintained; it is usually one graduated senior
          whose Drive held everything.
        </p>

        <ul className="mt-4 card divide-y divide-line p-4">
          {departments.map((department) => (
            <RotBar key={department.key} slice={department} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-lg font-semibold text-fg">
          Every check so far
        </h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          {summary.longestDeadDays > 0
            ? `The longest-broken link has been broken for ${summary.longestDeadDays} day${
                summary.longestDeadDays === 1 ? "" : "s"
              } of recorded history. `
            : ""}
          {summary.recovered > 0
            ? `${summary.recovered} link${
                summary.recovered === 1 ? " has" : "s have"
              } come back since the first check.`
            : "No link has come back yet — every rescue so far has meant someone re-uploading the file."}
        </p>

        <div className="mt-4 card overflow-x-auto p-4">
          <table className="w-full min-w-[34rem] text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Checked
                </th>
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Resources
                </th>
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Dead
                </th>
                <th scope="col" className="pb-2 pr-4 font-medium">
                  Change
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Verdicts
                </th>
              </tr>
            </thead>
            <tbody>
              {checks.map((run, index) => (
                <RunRow
                  key={run.checkedAt}
                  run={run}
                  previous={checks[index - 1]}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="method-heading"
        className="card border-brand/30 p-5"
      >
        <h2
          id="method-heading"
          className="flex items-center gap-2 text-sm font-semibold text-fg"
        >
          <Icon name="sparkles" className="h-4 w-4 text-brand" />
          How a link is judged dead
        </h2>
        <div className="prose-page mt-2 max-w-prose text-sm">
          <p>
            An anonymous request cannot tell &ldquo;this folder was
            deleted&rdquo; from &ldquo;this folder is shared only with RVCE
            accounts&rdquo; — both answer with a sign-in wall. So the checker
            never calls a Drive link dead on a sign-in page alone: that is
            recorded as <code>needs-auth</code>, which is the normal, healthy
            state for most of this catalog and is never flagged on the site.
          </p>
          <p>
            Only a hard 404 from Drive (<code>probably-gone</code>) or from a
            GitHub repository (<code>dead</code>) counts, which is why the
            numbers here are a floor rather than an estimate. The code is{" "}
            <code>scripts/check-links.mjs</code>; it runs weekly in CI and
            appends its verdict to{" "}
            <code>src/data/generated/link-history.json</code>.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <AddNotesButton label="Re-upload something you have" />
          <Link
            href="/gaps"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            See the subjects with nothing left
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
