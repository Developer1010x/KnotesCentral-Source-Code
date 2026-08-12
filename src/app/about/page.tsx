import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/icons";
import { SITE } from "@/lib/site";
import { AddNotesButton } from "@/components/ContributeCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "What Knotes Central is, how the notes are stored, and how RVCE students can keep it going.",
};

const STEPS = [
  {
    title: "Upload and share",
    body: "Put your files in a Google Drive folder and share it with RVCE, or push them to a public GitHub repo.",
  },
  {
    title: "Open the form",
    body: "Pick the department, year and semester, paste the link, and submit. It is a GitHub issue form — no Git knowledge needed.",
  },
  {
    title: "It goes live",
    body: "A maintainer adds the entry to the department file, and your name goes on the contributors page.",
  },
];

export default function About() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="About"
        title="Built by students, for the batches that follow"
        description={SITE.description}
        trail={[{ label: "Departments", href: "/" }, { label: "About" }]}
      />

      <div className="prose-page">
        <p>
          Knotes Central is a comprehensive collection of academic resources for
          RVCE — notes, question papers and lab manuals, gathered in one place
          so nobody has to hunt for them again. Our motto:{" "}
          <em>&quot;{SITE.motto}&quot;</em>
        </p>

        <h2>How to access the material</h2>
        <p>
          All notes are stored in RVCE Workspace Drive, so most links require
          you to be signed in with your college account. Some are made public
          during beta.
        </p>

        <h2>Declaration</h2>
        <p>
          This website is intended for the RVCE community. Its use is free and
          fair, strictly for educational purposes.
        </p>

        <h2>Keeping it alive</h2>
        <p>
          The site is open source, and the catalog is just a set of files in
          the repository — one per department. Anyone can add to it: either
          through a short form, or by editing the department file directly on
          GitHub. As each batch graduates, the next one keeps it current. That
          is the only reason anything here exists.
        </p>
      </div>

      <section aria-labelledby="contribute-heading">
        <h2
          id="contribute-heading"
          className="text-lg font-semibold text-fg"
        >
          How to contribute
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                {i + 1}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-fg">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap gap-2">
          <AddNotesButton label="Add notes now" />
          <Link
            href="/contribute"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
          >
            See both ways to contribute
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold text-fg">Previous versions</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <a
              href="https://knotes-central-v3.github.io/KnotesCentralV1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Knotes Central V1
            </a>
          </li>
          <li>
            <a
              href="https://knotes-central-v3.github.io/KnotesCentralV2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Knotes Central V2
            </a>
          </li>
        </ul>
      </section>

      <p className="text-sm text-muted">
        Questions, suggestions or corrections?{" "}
        <Link href="/contact" className="font-medium text-brand hover:underline">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}
