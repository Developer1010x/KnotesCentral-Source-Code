import type { Note, NoteType } from "@/data/types";

export interface NoteTypeMeta {
  label: string;
  /** Short form used on chips where space is tight. */
  short: string;
  /** Tailwind classes for the badge. Colour tokens live in globals.css. */
  chip: string;
  dot: string;
}

export const NOTE_TYPE_ORDER: NoteType[] = ["theory", "lab", "question-paper"];

export const NOTE_TYPES: Record<NoteType, NoteTypeMeta> = {
  theory: {
    label: "Theory notes",
    short: "Theory",
    chip: "bg-theory/10 text-theory ring-1 ring-inset ring-theory/25",
    dot: "bg-theory",
  },
  lab: {
    label: "Lab material",
    short: "Lab",
    chip: "bg-lab/10 text-lab ring-1 ring-inset ring-lab/25",
    dot: "bg-lab",
  },
  "question-paper": {
    label: "Question papers",
    short: "PYQP",
    chip: "bg-paper/10 text-paper ring-1 ring-inset ring-paper/25",
    dot: "bg-paper",
  },
};

export function noteTypeMeta(type: NoteType): NoteTypeMeta {
  return (
    NOTE_TYPES[type] ?? {
      label: type,
      short: type,
      chip: "bg-raised text-muted ring-1 ring-inset ring-line",
      dot: "bg-muted",
    }
  );
}

export type NoteHost = "drive" | "github" | "docs" | "link";

/**
 * Where a note actually lives. Juniors need to know before they click whether
 * it is a Drive folder (RVCE login) or a public GitHub repo.
 */
export function noteHost(note: Note): NoteHost {
  const url = note.link.toLowerCase();
  if (url.includes("drive.google.com")) return "drive";
  if (url.includes("docs.google.com")) return "docs";
  if (url.includes("github.")) return "github";
  return "link";
}

export const HOST_LABEL: Record<NoteHost, string> = {
  drive: "Google Drive · RVCE login",
  docs: "Google Docs",
  github: "GitHub",
  link: "External link",
};
