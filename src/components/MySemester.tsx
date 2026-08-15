"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { useMySemester } from "@/lib/prefs";

export interface DeptOption {
  link: string;
  name: string;
  years: { year: number; semesters: number[] }[];
}

/**
 * "Set your semester once, land on it every time."
 * The option tree is passed in from the server so the full catalog never has
 * to ship to the client.
 */
export function MySemester({ options }: { options: DeptOption[] }) {
  const { mine, setMine, hydrated } = useMySemester();
  const [editing, setEditing] = useState(false);

  const chosen = useMemo(
    () => options.find((option) => option.link === mine?.department),
    [options, mine?.department]
  );

  // Render nothing until localStorage is read, so the server and client agree.
  if (!hydrated) return <div className="skeleton h-28 w-full rounded-card" />;

  if (mine && chosen && !editing) {
    const path = `${mine.department}/${mine.year}/${mine.semester}`;

    return (
      <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Your semester
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold text-fg">
            {chosen.name}
          </h2>
          <p className="text-sm text-muted">
            Year {mine.year} · Semester {mine.semester}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={path}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-contrast hover:opacity-90"
          >
            Open my subjects
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link
            href={`${path}/exam-prep`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
          >
            <Icon name="target" className="h-4 w-4" />
            Exam prep
          </Link>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:text-fg"
          >
            Change
          </button>
        </div>
      </section>
    );
  }

  return (
    <SemesterPicker
      options={options}
      initial={mine}
      onSave={(value) => {
        setMine(value);
        setEditing(false);
      }}
      onCancel={mine ? () => setEditing(false) : undefined}
    />
  );
}

function SemesterPicker({
  options,
  initial,
  onSave,
  onCancel,
}: {
  options: DeptOption[];
  initial: { department: string; year: number; semester: number } | null;
  onSave: (value: { department: string; year: number; semester: number }) => void;
  onCancel?: () => void;
}) {
  const [department, setDepartment] = useState(
    initial?.department ?? options[0]?.link ?? ""
  );
  const dept = options.find((option) => option.link === department);

  const [year, setYear] = useState(initial?.year ?? dept?.years[0]?.year ?? 1);
  const yearEntry =
    dept?.years.find((entry) => entry.year === year) ?? dept?.years[0];

  const [semester, setSemester] = useState(
    initial?.semester ?? yearEntry?.semesters[0] ?? 1
  );

  const select =
    "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-fg outline-none focus:border-brand";

  return (
    <section className="card p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Icon name="target" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-fg">
            Set your semester
          </h2>
          <p className="mt-1 text-sm text-muted">
            Do it once and your subjects are one tap away every time you come
            back. Stored on this device only.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">
            Department
          </span>
          <select
            className={select}
            value={department}
            onChange={(e) => {
              const next = options.find((o) => o.link === e.target.value);
              setDepartment(e.target.value);
              const firstYear = next?.years[0];
              setYear(firstYear?.year ?? 1);
              setSemester(firstYear?.semesters[0] ?? 1);
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
          <span className="mb-1 block text-xs font-medium text-muted">Year</span>
          <select
            className={select}
            value={year}
            onChange={(e) => {
              const nextYear = Number(e.target.value);
              setYear(nextYear);
              const entry = dept?.years.find((y) => y.year === nextYear);
              setSemester(entry?.semesters[0] ?? 1);
            }}
          >
            {dept?.years.map((entry) => (
              <option key={entry.year} value={entry.year}>
                Year {entry.year}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">
            Semester
          </span>
          <select
            className={select}
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

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onSave({ department, year, semester })}
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-contrast hover:opacity-90"
        >
          Save my semester
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted hover:text-fg"
          >
            Cancel
          </button>
        )}
      </div>
    </section>
  );
}
