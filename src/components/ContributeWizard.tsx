"use client";

import { useMemo, useState } from "react";
import type { NoteType } from "@/data/types";
import type { DeptOption } from "@/components/MySemester";
import { Icon } from "@/components/ui/icons";
import { NOTE_TYPE_ORDER, noteTypeMeta } from "@/lib/noteTypes";
import { addNotesIssueUrl, githubEditUrl } from "@/lib/site";

const field =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-brand";

const label = "mb-1 block text-xs font-medium text-muted";

/**
 * Turns "I have a Drive link" into a ready-to-paste catalog entry plus the two
 * one-click ways to land it: GitHub's editor on the exact file, or a fully
 * prefilled issue for people who would rather not touch code at all.
 */
export function ContributeWizard({ options }: { options: DeptOption[] }) {
  const [department, setDepartment] = useState(options[0]?.link ?? "");
  const [year, setYear] = useState(options[0]?.years[0]?.year ?? 1);
  const [semester, setSemester] = useState(
    options[0]?.years[0]?.semesters[0] ?? 1
  );
  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<NoteType>("theory");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const dept = options.find((option) => option.link === department);
  const yearEntry = dept?.years.find((entry) => entry.year === year);
  const slug = department.replace(/^\//, "");

  const linkLooksWrong = link.length > 0 && !/^https?:\/\//i.test(link);
  const complete = subject && title && link && !linkLooksWrong;

  const snippet = useMemo(
    () =>
      `{
  name: ${JSON.stringify(subject || "Subject name")},
  subject_code: ${JSON.stringify(code || "")},
  notes: [
    {
      title: ${JSON.stringify(title || "What the material is")},
      type: ${JSON.stringify(type)},
      link: ${JSON.stringify(link || "https://drive.google.com/...")},
    },
  ],
},`,
    [subject, code, title, type, link]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="card space-y-4 p-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block sm:col-span-3">
            <span className={label}>Department</span>
            <select
              className={field}
              value={department}
              onChange={(e) => {
                const next = options.find((o) => o.link === e.target.value);
                setDepartment(e.target.value);
                setYear(next?.years[0]?.year ?? 1);
                setSemester(next?.years[0]?.semesters[0] ?? 1);
              }}
            >
              {options.map((option) => (
                <option key={option.link} value={option.link}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={label}>Year</span>
            <select
              className={field}
              value={year}
              onChange={(e) => {
                const nextYear = Number(e.target.value);
                setYear(nextYear);
                setSemester(
                  dept?.years.find((y) => y.year === nextYear)?.semesters[0] ?? 1
                );
              }}
            >
              {dept?.years.map((entry) => (
                <option key={entry.year} value={entry.year}>
                  Year {entry.year}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className={label}>Semester</span>
            <select
              className={field}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              {yearEntry?.semesters.map((number) => (
                <option key={number} value={number}>
                  Semester {number}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block sm:col-span-2">
            <span className={label}>Subject name</span>
            <input
              className={field}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Data Structures and its Applications"
            />
          </label>
          <label className="block">
            <span className={label}>Subject code</span>
            <input
              className={field}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="CSE201"
            />
          </label>
        </div>

        <div>
          <span className={label}>What kind of material?</span>
          <div className="flex flex-wrap gap-2">
            {NOTE_TYPE_ORDER.map((option) => {
              const meta = noteTypeMeta(option);
              const active = type === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setType(option)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active ? meta.chip : "border border-line text-muted hover:text-fg"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className={label}>Title shown on the site</span>
          <input
            className={field}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="DSA Unit 1-5 notes"
          />
        </label>

        <label className="block">
          <span className={label}>Link</span>
          <input
            className={field}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            inputMode="url"
          />
          {linkLooksWrong && (
            <span className="mt-1 block text-xs text-paper">
              Paste the full link, starting with https://
            </span>
          )}
        </label>
      </form>

      <div className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-fg">Your entry</h2>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-fg hover:border-brand/40 hover:text-brand"
            >
              <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-raised p-4 text-xs leading-6 text-fg">
            <code>{snippet}</code>
          </pre>
        </div>

        <div className="card space-y-3 p-5">
          <h2 className="text-sm font-semibold text-fg">Now send it</h2>
          <a
            href={githubEditUrl(slug)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={copy}
            className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              complete
                ? "bg-brand text-brand-contrast hover:opacity-90"
                : "pointer-events-none bg-raised text-muted"
            }`}
            aria-disabled={!complete}
          >
            <span className="flex items-center gap-2">
              <Icon name="github" className="h-4 w-4" />
              Copy &amp; open the file on GitHub
            </span>
            <Icon name="external" className="h-4 w-4" />
          </a>
          <p className="text-xs leading-5 text-muted">
            Opens{" "}
            <code className="rounded bg-raised px-1 py-0.5">
              src/data/departments/{slug || "…"}.ts
            </code>{" "}
            in GitHub&apos;s editor with your entry on the clipboard. Find year{" "}
            {year}, semester {semester}, paste into its{" "}
            <code className="rounded bg-raised px-1 py-0.5">subjects</code>{" "}
            array, and propose the change — GitHub forks the repo for you.
          </p>

          <a
            href={addNotesIssueUrl({
              department: dept?.name,
              year,
              semester,
              subject,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-lg border border-line px-4 py-3 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
          >
            <span className="flex items-center gap-2">
              <Icon name="inbox" className="h-4 w-4" />
              Or let a maintainer do it
            </span>
            <Icon name="external" className="h-4 w-4" />
          </a>
          <p className="text-xs leading-5 text-muted">
            Sends the same details as an issue — no code, no pull request.
          </p>
        </div>
      </div>
    </div>
  );
}
