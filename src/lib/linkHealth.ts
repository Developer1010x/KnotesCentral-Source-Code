import status from "@/data/generated/link-status.json";
import type { Note } from "@/data/types";

const GONE = (status as { gone: Record<string, string> }).gone ?? {};

export const LINK_CHECKED_AT = (status as { checkedAt?: string }).checkedAt;

/**
 * Whether a link was dead at the last automated check.
 *
 * Only hard verdicts land here — a Drive folder that merely asks for an RVCE
 * sign-in is healthy and is never recorded, so this never wrongly warns off a
 * link that works once you are logged in.
 */
export function isGone(note: Note): boolean {
  return Boolean(note.link) && note.link in GONE;
}

export function goneCount(): number {
  return Object.keys(GONE).length;
}

/** A note is usable if it has a link and that link still resolves. */
export function isUsable(note: Note): boolean {
  return Boolean(note.link.trim()) && !isGone(note);
}

export function countUsable(notes: Note[]): { usable: number; broken: number } {
  let usable = 0;
  let broken = 0;

  for (const note of notes) {
    if (isUsable(note)) usable += 1;
    else broken += 1;
  }

  return { usable, broken };
}
