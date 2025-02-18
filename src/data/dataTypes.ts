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

export interface Note {
  title: string;
  type: "theory" | "lab" | "question-paper";
  link: string;
}

export interface Contributors {
  name: string;
  contribution:"Developer" | "Notes" | "GDrive";
  description: string;
  department: string;
  year: number;
  link: string;
}
