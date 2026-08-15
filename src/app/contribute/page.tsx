import type { Metadata } from "next";
import { departments } from "@/data/departments";
import { PageHeader } from "@/components/ui/PageHeader";
import { AddNotesButton } from "@/components/ContributeCTA";
import { Icon } from "@/components/ui/icons";
import { ContributeWizard } from "@/components/ContributeWizard";
import { departmentOptions, departmentSlug } from "@/lib/catalog";
import { githubEditUrl, REPO_URL, reportIssueUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contribute notes",
  description:
    "Two ways to add notes to KnotesNeo: a short GitHub form, or editing the department file directly.",
};

const SNIPPET = `{
  name: "Data Structures and its Applications",
  subject_code: "CSE201",
  notes: [
    {
      title: "DSA Unit 1-5 notes",
      type: "theory",          // "theory" | "lab" | "question-paper"
      link: "https://drive.google.com/drive/folders/...",
    },
  ],
}`;

export default function ContributePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Contribute"
        title="Add notes in about a minute"
        description="Everything on this site was uploaded by a student one or two years ahead of whoever is reading it. Here is how you join them."
        trail={[{ label: "Departments", href: "/" }, { label: "Contribute" }]}
      />

      <section aria-labelledby="wizard-heading">
        <h2 id="wizard-heading" className="text-lg font-semibold text-fg">
          Build your entry
        </h2>
        <p className="mt-1 max-w-prose text-sm text-muted">
          Fill this in and it writes the catalog entry for you — then send it
          either way below.
        </p>
        <div className="mt-4">
          <ContributeWizard options={departmentOptions()} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card flex flex-col p-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
            Easiest
          </span>
          <h2 className="mt-3 text-lg font-semibold text-fg">
            Fill a short form on GitHub
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Pick the department, year and semester, paste your Google Drive or
            GitHub link, and submit. A maintainer adds it to the site. You need
            a free GitHub account and nothing else — no Git, no code.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-muted">
            {[
              "Upload your files to Drive and share them with RVCE.",
              "Open the form and paste the link.",
              "Add your name if you want the credit.",
            ].map((step, i) => (
              <li key={step} className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-raised text-[11px] font-bold text-fg">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-auto pt-5">
            <AddNotesButton label="Open the form" />
          </div>
        </div>

        <div className="card flex flex-col p-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-raised px-2.5 py-0.5 text-xs font-semibold text-muted">
            Direct
          </span>
          <h2 className="mt-3 text-lg font-semibold text-fg">
            Edit the department file yourself
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Each department is a single file. Click edit, add your entry in the
            right semester, and GitHub opens a pull request for you — it forks
            the repo automatically, so you cannot break anything.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-raised p-4 text-xs leading-6 text-fg">
            <code>{SNIPPET}</code>
          </pre>
          <p className="mt-3 text-xs text-muted">
            Keep the shape exactly as above — the site reads these files
            directly, and a typo shows up as a build failure on your pull
            request rather than a broken page.
          </p>
        </div>
      </section>

      <section aria-labelledby="files-heading">
        <h2 id="files-heading" className="text-lg font-semibold text-fg">
          Edit a department directly
        </h2>
        <p className="mt-1 text-sm text-muted">
          Opens GitHub&apos;s editor on that department&apos;s file.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <a
              key={department.link}
              href={githubEditUrl(departmentSlug(department))}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-fg transition hover:border-brand/40 hover:text-brand"
            >
              <Icon name="github" className="h-4 w-4 shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate">{department.name}</span>
              <Icon
                name="external"
                className="h-3.5 w-3.5 shrink-0 text-muted opacity-0 group-hover:opacity-100"
              />
            </a>
          ))}
        </div>
      </section>

      <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-fg">
            Found a dead link instead?
          </h2>
          <p className="mt-1 text-sm text-muted">
            Report it and it gets fixed — that is a contribution too.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={reportIssueUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
          >
            Report a broken link
            <Icon name="external" className="h-4 w-4" />
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
          >
            <Icon name="github" className="h-4 w-4" />
            View the repo
          </a>
        </div>
      </section>
    </div>
  );
}
