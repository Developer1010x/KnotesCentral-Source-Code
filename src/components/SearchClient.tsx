"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { NoteType } from "@/data/types";
import {
  availableNoteTypes,
  departmentOptions,
  searchSubjects,
  semesterPath,
  subjectPath,
} from "@/lib/catalog";
import { countUsable } from "@/lib/linkHealth";
import { noteTypeMeta } from "@/lib/noteTypes";
import { CardGrid } from "@/components/ui/Card";
import { SubjectCard } from "@/components/SubjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/icons";

const MAX_RESULTS = 60;
const FILTERS = availableNoteTypes();
const DEPARTMENTS = departmentOptions();

export function SearchClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [types, setTypes] = useState<NoteType[]>([]);
  const [department, setDepartment] = useState("");
  const [onlyWorking, setOnlyWorking] = useState(true);
  // Keeps typing responsive: filtering runs against a lagging value.
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    let hits = searchSubjects(deferredQuery, { types });

    if (department) {
      hits = hits.filter((hit) => hit.department.link === department);
    }

    // Dead links are still in the catalog; most people searching want the
    // things they can actually open.
    if (onlyWorking) {
      hits = hits.filter((hit) => countUsable(hit.subject.notes).usable > 0);
    }

    return hits;
  }, [deferredQuery, types, department, onlyWorking]);

  const toggleType = (type: NoteType) =>
    setTypes((current) =>
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type]
    );

  // Keep the URL in step so a search can be sent to someone as a link.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (current === deferredQuery) return;

    const next = deferredQuery
      ? `/search?q=${encodeURIComponent(deferredQuery)}`
      : "/search";
    router.replace(next, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredQuery]);

  const shown = results.slice(0, MAX_RESULTS);

  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-6">
        <h1 className="text-display-sm font-bold text-fg">Search</h1>
        <p className="mt-2 max-w-prose text-[0.975rem] leading-7 text-muted">
          Look up any subject by name or code — or search the note titles
          themselves.
        </p>

        <div className="relative mt-5 max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="search" className="h-5 w-5" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Data Structures, CSE201, DBMS lab"
            aria-label="Search subjects and notes"
            className="w-full rounded-lg border border-line bg-surface py-3 pl-12 pr-4 text-[0.975rem] text-fg shadow-card outline-none placeholder:text-muted focus:border-brand"
            autoFocus
          />
        </div>

        <div
          className={`mt-4 flex-wrap items-center gap-2 ${
            FILTERS.length > 1 ? "flex" : "hidden"
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted">
            Filter
          </span>
          {FILTERS.map((type) => {
            const meta = noteTypeMeta(type);
            const active = types.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? meta.chip
                    : "border border-line text-muted hover:text-fg"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.short}
              </button>
            );
          })}
          {types.length > 0 && (
            <button
              type="button"
              onClick={() => setTypes([])}
              className="text-xs font-medium text-brand hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted">
            Department
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-fg outline-none focus:border-brand"
            >
              <option value="">All departments</option>
              {DEPARTMENTS.map((option) => (
                <option key={option.link} value={option.link}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={onlyWorking}
              onChange={(e) => setOnlyWorking(e.target.checked)}
              className="h-3.5 w-3.5 accent-[rgb(var(--brand))]"
            />
            Hide subjects with no working links
          </label>
        </div>
      </header>

      {deferredQuery && (
        <p className="text-sm text-muted" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "subject" : "subjects"} match
          “{deferredQuery}”
          {results.length > MAX_RESULTS && ` — showing the first ${MAX_RESULTS}`}
        </p>
      )}

      {shown.length > 0 && (
        <CardGrid>
          {shown.map((hit) => (
            <SubjectCard
              key={`${subjectPath(hit)}-${hit.subject.subject_code}-${hit.subject.name}`}
              subject={hit.subject}
              semester={hit.semester}
              semesterPath={semesterPath(hit)}
              meta={
                <Link
                  href={semesterPath(hit)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-brand"
                >
                  {hit.department.name} · Year {hit.year.year} · Sem{" "}
                  {hit.semester.number}
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </Link>
              }
            />
          ))}
        </CardGrid>
      )}

      {deferredQuery && results.length === 0 && (
        <EmptyState
          icon="search"
          title={`Nothing found for “${deferredQuery}”`}
          description="Try the subject code instead of the name, or drop the filters. If it genuinely is not here yet, you can be the one to add it."
        />
      )}

      {!deferredQuery && (
        <p className="text-sm text-muted">
          Tip: press <kbd className="rounded border border-line px-1.5 py-0.5 text-[11px]">⌘K</kbd>{" "}
          anywhere on the site to search without coming back here.
        </p>
      )}
    </div>
  );
}
