import { describe, expect, it } from "vitest";
import {
  PAGE_INDEX,
  SEARCH_INDEX,
  queryIndex,
  queryPages,
} from "@/lib/searchIndex";
import {
  allSubjects,
  findDepartment,
  findSemester,
  findSubject,
  findYear,
  subjectPath,
} from "@/lib/catalog";

describe("the command palette index", () => {
  it("has one entry per subject in the catalog", () => {
    expect(SEARCH_INDEX.length).toBe(allSubjects().length);
  });

  it("points at the subject page, the same place /search links to", () => {
    // These used to disagree: the palette sent you to the semester listing and
    // the search page to the subject, for the same query.
    const bySubject = new Map(
      allSubjects().map((location) => [
        `${location.subject.name}|${location.subject.subject_code}|${location.semester.number}`,
        subjectPath(location),
      ])
    );

    for (const entry of SEARCH_INDEX) {
      const expected = bySubject.get(
        `${entry.name}|${entry.code}|${entry.semester}`
      );
      expect(expected, entry.name).toBeDefined();
      expect(entry.path).toBe(expected);
    }
  });

  it("only produces paths that resolve to a real subject", () => {
    for (const entry of SEARCH_INDEX) {
      const [, department, year, semester, slug] = entry.path.split("/");
      const found = findSubject(
        findSemester(findYear(findDepartment(department), year), semester),
        slug
      );
      expect(found?.name, entry.path).toBe(entry.name);
    }
  });

  it("ranks an exact code match first and respects the limit", () => {
    const withCode = SEARCH_INDEX.find((entry) => entry.code.length > 2);
    const hits = queryIndex(withCode!.code, 5);

    expect(hits.length).toBeGreaterThan(0);
    expect(hits.length).toBeLessThanOrEqual(5);
    expect(hits[0].code.toLowerCase()).toBe(withCode!.code.toLowerCase());
  });

  it("matches note titles through the haystack", () => {
    const entry = SEARCH_INDEX.find(
      (candidate) => candidate.notes > 0 && candidate.haystack.includes(" ")
    );
    const word = entry!.haystack.split(" ").find((part) => part.length > 5);

    expect(queryIndex(word!).length).toBeGreaterThan(0);
  });

  it("returns nothing for an empty query", () => {
    expect(queryIndex("")).toEqual([]);
    expect(queryPages("")).toEqual([]);
  });
});

describe("the palette's page index", () => {
  it("lists every static destination as an absolute path", () => {
    for (const page of PAGE_INDEX) {
      expect(page.path.startsWith("/"), page.path).toBe(true);
    }
  });

  it("finds a page by name", () => {
    expect(queryPages("rot").map((page) => page.path)).toContain("/rot");
    expect(queryPages("saved").map((page) => page.path)).toContain("/saved");
  });
});
