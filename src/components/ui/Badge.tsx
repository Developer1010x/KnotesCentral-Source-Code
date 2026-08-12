import type { ReactNode } from "react";
import type { NoteType } from "@/data/types";
import { noteTypeMeta } from "@/lib/noteTypes";
import type { NoteCounts } from "@/lib/catalog";
import { NOTE_TYPE_ORDER } from "@/lib/noteTypes";

export function Badge({
  children,
  className = "bg-raised text-muted ring-1 ring-inset ring-line",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

export function NoteTypeBadge({
  type,
  count,
}: {
  type: NoteType;
  count?: number;
}) {
  const meta = noteTypeMeta(type);
  return (
    <Badge className={meta.chip}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {count === undefined ? meta.short : `${count} ${meta.short}`}
    </Badge>
  );
}

/** "3 Theory · 1 Lab" coverage strip. Silent about types with nothing in them. */
export function CoverageBadges({
  counts,
  className = "",
}: {
  counts: NoteCounts;
  className?: string;
}) {
  const present = NOTE_TYPE_ORDER.filter((type) => counts[type] > 0);
  if (!present.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`.trim()}>
      {present.map((type) => (
        <NoteTypeBadge key={type} type={type} count={counts[type]} />
      ))}
    </div>
  );
}
