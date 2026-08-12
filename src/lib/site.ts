/** Single place for the outward-facing links and copy the site repeats. */
export const SITE = {
  name: "Knotes Central",
  tagline: "Notes, lab manuals and question papers for RVCE — in one place.",
  motto: "For all, For Always!",
  description:
    "Every RVCE department, year and semester: theory notes, lab material and previous-year question papers, collected and kept up to date by students.",
  url: "https://knotescentral.github.io",
} as const;

/**
 * Site-wide banner. Set to null when there is nothing to announce; change the
 * `id` to re-show it to people who dismissed the previous notice.
 */
export const SITE_NOTICE: {
  id: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
} | null = {
  id: "drives-deleted-2026-08",
  title: "Many Drive folders have been deleted",
  body:
    "RVCE accounts are purged after students graduate, and their Drive files go with them. A lot of links here are dead as a result — they are marked below, and we are working on re-uploading the material somewhere it cannot expire. If you still have any of these files, please send them.",
  href: "/contribute",
  linkLabel: "Help re-upload notes",
};

/* ------------------------------------------------------- contributing flow */

export const GITHUB = {
  owner: "Developer1010x",
  repo: "knotesneo",
  branch: "main",
} as const;

export const REPO_URL = `https://github.com/${GITHUB.owner}/${GITHUB.repo}`;

/** Where a department's catalog entry lives in the repo. */
export const departmentDataPath = (slug: string) =>
  `src/data/departments/${slug}.ts`;

/** One-click "edit this file" — GitHub forks it for the user automatically. */
export function githubEditUrl(slug: string) {
  return `${REPO_URL}/edit/${GITHUB.branch}/${departmentDataPath(slug)}`;
}

export function githubFileUrl(slug: string) {
  return `${REPO_URL}/blob/${GITHUB.branch}/${departmentDataPath(slug)}`;
}

/**
 * Prefilled issue form for people who would rather not touch code — they paste
 * a Drive link and a maintainer merges it. `add-notes.yml` defines the fields.
 */
export function addNotesIssueUrl(context: {
  department?: string;
  year?: number | string;
  semester?: number | string;
  subject?: string;
} = {}) {
  const params = new URLSearchParams({ template: "add-notes.yml" });

  if (context.department) params.set("department", context.department);
  if (context.year !== undefined) params.set("year", String(context.year));
  if (context.semester !== undefined)
    params.set("semester", String(context.semester));
  if (context.subject) params.set("subject", context.subject);
  params.set(
    "title",
    `Add notes: ${[context.department, context.subject].filter(Boolean).join(" — ") || "new material"}`
  );

  return `${REPO_URL}/issues/new?${params.toString()}`;
}

/** Report a dead Drive link or a wrong entry. */
export function reportIssueUrl(context: { page?: string } = {}) {
  const params = new URLSearchParams({ template: "broken-link.yml" });
  if (context.page) params.set("page", context.page);
  return `${REPO_URL}/issues/new?${params.toString()}`;
}

/* ------------------------------------------------------------- other links */

export const CONTACT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSek3-e8OHFkYXfa6RajVYPwCa4JHeJnM1V4JAJim7d-3_XTIw/viewform";

export const CONTACT_EMAIL = "knotescentral@gmail.com";

export const CONTRIBUTORS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1WjA5blnF5cq-2GIFe6Ib_yKbacw26cyW133MTlwYtF4/edit?usp=sharing";

export const REDDIT = {
  rvce: "https://www.reddit.com/r/rvce/",
  knotes: "https://www.reddit.com/r/KnotesCentral/",
} as const;
