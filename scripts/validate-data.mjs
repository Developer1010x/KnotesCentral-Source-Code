#!/usr/bin/env node
/**
 * Catches the mistakes a first-time contributor actually makes, with a message
 * that says how to fix it. Runs in CI on every pull request, so a bad entry
 * fails the check instead of shipping a broken card.
 *
 *   npm run check:data
 *   node scripts/validate-data.mjs --dir=path/to/departments   # used by tests
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// The directory is an argument so the checks can be tested against fixtures of
// deliberately broken data; without it, nothing here is verifiable except by
// breaking the real catalog.
const dirArgument = process.argv
  .slice(2)
  .find((argument) => argument.startsWith("--dir="));

const DIR = dirArgument
  ? resolve(root, dirArgument.slice("--dir=".length))
  : resolve(root, "src/data/departments");

/** Paths in messages stay relative to the repository root. */
const relative = (file) => `${DIR.replace(`${root}/`, "")}/${file}`;

const VALID_TYPES = new Set(["theory", "lab", "question-paper"]);

const problems = [];
const warnings = [];

const fail = (file, message) => problems.push({ file, message });
const warn = (file, message) => warnings.push({ file, message });

/** Reads the exported object literals without executing TypeScript. */
function fields(text, key) {
  return Array.from(
    text.matchAll(new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g")),
    (match) => match[1]
  );
}

/** Same, for unquoted numeric fields like `year: 2` and `number: 3`. */
function numberFields(text, key) {
  return Array.from(
    text.matchAll(new RegExp(`\\b${key}:\\s*(-?\\d+)`, "g")),
    (match) => Number(match[1])
  );
}

const files = readdirSync(DIR).filter(
  (file) => file.endsWith(".ts") && file !== "index.ts"
);

const index = readFileSync(resolve(DIR, "index.ts"), "utf8");
const seenLinks = new Map();
const seenSlugs = new Set();

for (const file of files) {
  const path = relative(file);
  const text = readFileSync(resolve(DIR, file), "utf8");

  // Registered in the barrel file?
  const moduleName = file.replace(/\.ts$/, "");
  if (!index.includes(`"./${moduleName}"`)) {
    fail(
      path,
      `not imported in index.ts — add it there or the department will not appear on the site`
    );
  }

  // Balanced braces catch the classic "pasted one brace too few".
  const open = (text.match(/{/g) ?? []).length;
  const close = (text.match(/}/g) ?? []).length;
  if (open !== close) {
    fail(path, `unbalanced braces (${open} "{" vs ${close} "}")`);
  }

  const links = fields(text, "link");
  const types = fields(text, "type");
  const titles = fields(text, "title");

  const deptLink = links.find((link) => link.startsWith("/"));
  if (!deptLink) {
    fail(path, `no department link — needs a top-level link like "/cse-ise-aiml"`);
  } else {
    const slug = deptLink.replace(/^\//, "");
    if (seenSlugs.has(slug.toLowerCase())) {
      fail(path, `duplicate department link "${deptLink}"`);
    }
    seenSlugs.add(slug.toLowerCase());
  }

  // Out-of-range years and semesters used to ship as real, sitemap-indexed
  // URLs (/MegaAccess/1/12340). 0 is the deliberate "not tied to a semester"
  // value used by /pyqp, /miscellaneous and /all-engineering.
  for (const year of numberFields(text, "year")) {
    if (!Number.isInteger(year) || year < 0 || year > 4) {
      fail(
        path,
        `year ${year} is out of range — use 1-4, or 0 for material that is not tied to a year`
      );
    }
  }

  for (const semester of numberFields(text, "number")) {
    if (!Number.isInteger(semester) || semester < 0 || semester > 8) {
      fail(
        path,
        `semester ${semester} is out of range — use 1-8, or 0 for material that is not tied to a semester`
      );
    }
  }

  for (const type of types) {
    if (!VALID_TYPES.has(type)) {
      fail(
        path,
        `type "${type}" is not valid — use ${[...VALID_TYPES]
          .map((value) => `"${value}"`)
          .join(", ")}`
      );
    }
  }

  for (const title of titles) {
    if (!title.trim()) fail(path, `a note has an empty title`);
  }

  for (const link of links) {
    if (link.startsWith("/")) continue; // department route, not a resource

    if (!link.trim()) {
      warn(path, `a note has no link yet — it shows as "not uploaded yet" on the site`);
      continue;
    }

    if (!/^https?:\/\//i.test(link)) {
      fail(path, `link "${link}" must start with http:// or https://`);
      continue;
    }

    if (/^https?:\/\/(drive|docs)\.google\.com\/?$/i.test(link)) {
      fail(path, `link "${link}" points at Google Drive's home page, not a file`);
    }

    const previous = seenLinks.get(link);
    if (previous && previous !== path) {
      warn(path, `link also used in ${previous} — is that intentional?`);
    }
    seenLinks.set(link, path);
  }

  // Notes without a matching title count usually mean a malformed entry.
  if (titles.length !== types.length) {
    fail(
      path,
      `${titles.length} titles but ${types.length} types — every note needs both`
    );
  }
}

for (const { file, message } of warnings) {
  console.warn(`warning  ${file}: ${message}`);
}

if (problems.length) {
  console.error("");
  for (const { file, message } of problems) {
    console.error(`error    ${file}: ${message}`);
  }
  console.error(
    `\n${problems.length} problem${problems.length === 1 ? "" : "s"} found. ` +
      `See CONTRIBUTING.md for the expected shape.`
  );
  process.exit(1);
}

console.log(
  `check:data — ${files.length} departments, ${seenLinks.size} links, no problems.`
);
