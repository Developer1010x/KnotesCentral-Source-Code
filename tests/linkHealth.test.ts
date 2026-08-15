import { describe, expect, it } from "vitest";
import type { Note } from "@/data/types";
import status from "@/data/generated/link-status.json";
import { countUsable, goneCount, isGone, isUsable } from "@/lib/linkHealth";
import { HOST_LABEL, noteHost, noteTypeMeta } from "@/lib/noteTypes";
import {
  deadForDays,
  deadSince,
  rotByDepartment,
  rotByHost,
  rotSummary,
  runs,
} from "@/lib/linkRot";

const note = (link: string): Note => ({ title: "note", type: "theory", link });

const deadLinks = Object.keys((status as { gone: Record<string, string> }).gone);

describe("noteHost", () => {
  it("names the host a reader is about to be sent to", () => {
    expect(noteHost(note("https://drive.google.com/drive/folders/x"))).toBe("drive");
    expect(noteHost(note("https://docs.google.com/document/d/x"))).toBe("docs");
    expect(noteHost(note("https://github.com/example/repo"))).toBe("github");
    expect(noteHost(note("https://example.com/notes.pdf"))).toBe("link");
  });

  it("flags the library server, which only answers on campus wifi", () => {
    // Shipped in the catalog as a normal link; off campus it simply hangs.
    expect(noteHost(note("http://172.16.44.10:8080/jspui/handle/1"))).toBe("campus");
    expect(noteHost(note("http://192.168.1.10/notes"))).toBe("campus");
    expect(noteHost(note("http://10.0.0.4:8080/x"))).toBe("campus");
    expect(HOST_LABEL.campus).toMatch(/campus/i);
  });

  it("does not mistake a public address for a private one", () => {
    expect(noteHost(note("https://172.32.0.1/x"))).toBe("link");
    expect(noteHost(note("https://110.0.0.1/x"))).toBe("link");
  });
});

describe("note types", () => {
  it("has a label and a colour for every type in the data", () => {
    for (const type of ["theory", "lab", "question-paper"] as const) {
      const meta = noteTypeMeta(type);
      expect(meta.label.length).toBeGreaterThan(0);
      expect(meta.chip).toContain("bg-");
    }
  });
});

describe("linkHealth", () => {
  it("treats a recorded dead link as unusable", () => {
    expect(deadLinks.length).toBeGreaterThan(0);
    expect(isGone(note(deadLinks[0]))).toBe(true);
    expect(isUsable(note(deadLinks[0]))).toBe(false);
  });

  it("treats an unrecorded link as usable, sign-in wall or not", () => {
    // "needs an RVCE login" is the healthy state for most of this catalog and
    // must never be reported as broken.
    expect(isGone(note("https://drive.google.com/drive/folders/not-checked"))).toBe(
      false
    );
    expect(isUsable(note("https://drive.google.com/drive/folders/not-checked"))).toBe(
      true
    );
  });

  it("treats an empty link as unusable but not as deleted", () => {
    expect(isUsable(note(""))).toBe(false);
    expect(isGone(note(""))).toBe(false);
  });

  it("splits a list into usable and broken", () => {
    const counts = countUsable([note(deadLinks[0]), note("https://example.com/a"), note("")]);
    expect(counts).toEqual({ usable: 1, broken: 2 });
    expect(goneCount()).toBe(deadLinks.length);
  });
});

describe("linkRot", () => {
  it("keeps the checks in chronological order", () => {
    const checkedAt = runs().map((run) => run.checkedAt);
    expect(checkedAt).toEqual([...checkedAt].sort());
    expect(checkedAt.length).toBeGreaterThan(0);
  });

  it("knows when each broken link was first seen broken", () => {
    for (const link of deadLinks) {
      const since = deadSince(note(link));
      expect(since, link).toBeDefined();
      expect(Number.isNaN(Date.parse(since!)), link).toBe(false);
      expect(deadForDays(note(link))).toBeGreaterThanOrEqual(0);
    }
  });

  it("says nothing about a link that has never been recorded broken", () => {
    expect(deadSince(note("https://example.com/never-checked"))).toBeUndefined();
    expect(deadForDays(note("https://example.com/never-checked"))).toBeUndefined();
  });

  it("counts the same dead links as the site's own health check", () => {
    const summary = rotSummary();
    expect(summary.dead).toBe(goneCount());
    expect(summary.links).toBeGreaterThan(summary.dead);
    expect(summary.share).toBeCloseTo(summary.dead / summary.links, 10);
  });

  it("accounts for every dead link exactly once when split by host", () => {
    const hosts = rotByHost();
    expect(hosts.reduce((sum, slice) => sum + slice.dead, 0)).toBe(goneCount());
    expect(hosts.reduce((sum, slice) => sum + slice.total, 0)).toBe(
      rotSummary().links
    );
  });

  it("counts a link shared by two branches in both of them", () => {
    // Per department this is the number of broken cards a reader sees, so the
    // departments add up to at least — and usually more than — the link count.
    const departments = rotByDepartment();
    expect(
      departments.reduce((sum, slice) => sum + slice.dead, 0)
    ).toBeGreaterThanOrEqual(goneCount());
  });

  it("keeps every slice internally consistent", () => {
    for (const slice of [...rotByHost(), ...rotByDepartment()]) {
      expect(slice.dead).toBeLessThanOrEqual(slice.total);
      expect(slice.total).toBeGreaterThan(0);
      expect(slice.share).toBeCloseTo(slice.dead / slice.total, 10);
    }
  });

  it("orders departments worst-hit first", () => {
    const shares = rotByDepartment().map((slice) => slice.share);
    expect(shares).toEqual([...shares].sort((a, b) => b - a));
  });
});
