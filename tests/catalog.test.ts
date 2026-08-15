import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Semester, Subject } from "@/data/types";
import {
  allSubjects,
  countNotes,
  departmentSlug,
  findDepartment,
  findSemester,
  findSubject,
  findYear,
  sameSubjectElsewhere,
  searchSubjects,
  slugify,
  subjectPath,
  subjectSlug,
} from "@/lib/catalog";
import { departments } from "@/data/departments";

const subject = (name: string, code: string, notes: Subject["notes"] = []): Subject => ({
  name,
  subject_code: code,
  notes,
});

const semester = (subjects: Subject[]): Semester => ({ number: 3, subjects });

describe("slugify", () => {
  it("keeps only url-safe characters", () => {
    expect(slugify("Data Structures & its Applications")).toBe(
      "data-structures-its-applications"
    );
    expect(slugify("  Trailing — punctuation!  ")).toBe("trailing-punctuation");
  });

  it("collapses a run of separators into one hyphen", () => {
    expect(slugify("C / C++  (basics)")).toBe("c-c-basics");
  });
});

describe("subjectSlug", () => {
  it("uses the subject name", () => {
    expect(subjectSlug(subject("Operating Systems", "CS301"))).toBe(
      "operating-systems"
    );
  });

  it("falls back to the code when the name has no usable characters", () => {
    expect(subjectSlug(subject("///", "CS301"))).toBe("cs301");
  });

  it("falls back to 'subject' when neither yields anything", () => {
    expect(subjectSlug(subject("", ""))).toBe("subject");
  });

  it("disambiguates two subjects sharing a name within one semester", () => {
    const first = subject("Elective", "CS351");
    const second = subject("Elective", "CS352");
    const sem = semester([first, second]);

    expect(subjectSlug(first, sem)).toBe("elective-cs351");
    expect(subjectSlug(second, sem)).toBe("elective-cs352");
    expect(subjectSlug(first, sem)).not.toBe(subjectSlug(second, sem));
  });

  it("leaves a unique name alone even when a semester is given", () => {
    const only = subject("Elective", "CS351");
    expect(subjectSlug(only, semester([only, subject("Maths", "MA301")]))).toBe(
      "elective"
    );
  });
});

describe("the real catalog", () => {
  it("gives every subject in a semester a distinct slug", () => {
    for (const department of departments) {
      for (const year of department.years) {
        for (const sem of year.semesters) {
          const slugs = sem.subjects.map((item) => subjectSlug(item, sem));
          expect(new Set(slugs).size, `${department.name} sem ${sem.number}`).toBe(
            slugs.length
          );
        }
      }
    }
  });

  it("names every department file after its own url slug", () => {
    // site.ts builds the "edit this file on GitHub" link by joining the slug
    // onto src/data/departments/, so a mismatch — /Maths served from maths.ts —
    // sends every contributor to a 404, and breaks the static export's URLs.
    for (const department of departments) {
      const slug = departmentSlug(department);
      expect(slug, `${department.name} slug`).toBe(slug.toLowerCase());
      expect(
        existsSync(fileURLToPath(new URL(`../src/data/departments/${slug}.ts`, import.meta.url))),
        `src/data/departments/${slug}.ts should exist for ${department.name}`
      ).toBe(true);
    }
  });

  it("resolves a subject page path back to the subject it came from", () => {
    for (const location of allSubjects()) {
      const [, dept, year, sem, slug] = subjectPath(location).split("/");
      const department = findDepartment(dept);
      const found = findSubject(
        findSemester(findYear(department, year), sem),
        slug
      );
      expect(found, subjectPath(location)).toBe(location.subject);
    }
  });

  it("finds a department whatever case the url uses", () => {
    const first = departments[0];
    const slug = departmentSlug(first);
    expect(findDepartment(slug.toUpperCase())).toBe(first);
    expect(findDepartment(slug.toLowerCase())).toBe(first);
  });
});

describe("countNotes", () => {
  it("counts each type and the total", () => {
    const counts = countNotes([
      { title: "a", type: "theory", link: "https://example.com/a" },
      { title: "b", type: "lab", link: "https://example.com/b" },
      { title: "c", type: "question-paper", link: "https://example.com/c" },
      { title: "d", type: "theory", link: "" },
    ]);

    expect(counts).toEqual({
      theory: 2,
      lab: 1,
      "question-paper": 1,
      total: 4,
    });
  });
});

describe("searchSubjects", () => {
  it("ranks an exact subject code above every weaker match", () => {
    const target = allSubjects().find(
      (location) => location.subject.subject_code.trim().length > 2
    );
    expect(target).toBeDefined();

    const code = target!.subject.subject_code;
    const hits = searchSubjects(code);

    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].score).toBe(100);
    expect(hits[0].subject.subject_code.toLowerCase()).toBe(code.toLowerCase());
  });

  it("returns hits in descending score order", () => {
    const hits = searchSubjects("data");
    const scores = hits.map((hit) => hit.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("matches note titles, and says which note matched", () => {
    const withNotes = allSubjects().find((location) =>
      location.subject.notes.some((note) => note.title.trim().length > 6)
    );
    const title = withNotes!.subject.notes[0].title;

    const hit = searchSubjects(title).find(
      (candidate) => candidate.subject === withNotes!.subject
    );

    expect(hit).toBeDefined();
    expect(hit!.matchedNotes.length).toBeGreaterThan(0);
  });

  it("returns the whole catalog for an empty query", () => {
    expect(searchSubjects("").length).toBe(allSubjects().length);
  });

  it("drops subjects with nothing of the requested type", () => {
    const hits = searchSubjects("", { types: ["question-paper"] });
    expect(hits.length).toBeGreaterThan(0);
    for (const hit of hits) {
      expect(hit.subject.notes.every((note) => note.type === "question-paper")).toBe(
        true
      );
    }
  });

  it("finds nothing for a query no subject contains", () => {
    expect(searchSubjects("zzzzz-not-a-subject")).toEqual([]);
  });
});

describe("sameSubjectElsewhere", () => {
  const usable = () => true;

  it("never returns a match from the subject's own department", () => {
    for (const location of allSubjects().slice(0, 60)) {
      for (const match of sameSubjectElsewhere(location, usable)) {
        expect(match.department.link).not.toBe(location.department.link);
      }
    }
  });

  it("matches on the slugified name or on the subject code", () => {
    const located = allSubjects().find(
      (location) => sameSubjectElsewhere(location, usable).length > 0
    );

    // Not every catalog has a cross-department duplicate; only assert when one
    // exists, so this stays a statement about the matcher, not about the data.
    if (!located) return;

    for (const match of sameSubjectElsewhere(located, usable)) {
      const sameName =
        slugify(match.subject.name) === slugify(located.subject.name);
      const sameCode =
        Boolean(located.subject.subject_code) &&
        match.subject.subject_code.toLowerCase() ===
          located.subject.subject_code.toLowerCase();

      expect(sameName || sameCode).toBe(true);
    }
  });

  it("respects the usability filter", () => {
    const located = allSubjects().find(
      (location) => sameSubjectElsewhere(location, usable).length > 0
    );
    if (!located) return;

    expect(sameSubjectElsewhere(located, () => false)).toEqual([]);
  });
});
