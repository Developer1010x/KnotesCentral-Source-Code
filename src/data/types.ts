export interface Department {
  name: string;
  description: string;
  link: string;
  years: Year[];
}

export interface Year {
  year: number;
  semesters: Semester[];
}

export interface Semester {
  number: number;
  subjects: Subject[];
}

export interface Subject {
  name: string;
  subject_code: string;
  notes: Note[];
}

export type NoteType = "theory" | "lab" | "question-paper";

export interface Note {
  title: string;
  type: NoteType;
  link: string;
}

export type Contribution =
  | "Developer"
  | "Notes"
  | "GDrive"
  | "Developer & Notes"
  | "Developer & GDrive"
  | "Notes & GDrive"
  | "Developer, Notes & GDrive";

export interface Contributor {
  name: string;
  contribution: Contribution;
  description: string;
  department: string;
  year: number;
  link: string;
}
