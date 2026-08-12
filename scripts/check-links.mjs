#!/usr/bin/env node
/**
 * Pings every resource link and classifies what came back.
 *
 *   npm run check:links              # human-readable report
 *   npm run check:links -- --json    # machine-readable, for CI
 *
 * IMPORTANT CAVEAT about Google Drive: an anonymous request cannot tell
 * "deleted" apart from "shared only with RVCE accounts" — both look like a
 * sign-in wall or a 404. Drive results are therefore reported as `needs-auth`
 * or `probably-gone`, never as a confident "dead". GitHub links are checkable
 * properly and are reported as ok/dead.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(root, "src/data/departments");
const JSON_OUT = process.argv.includes("--json");
const WRITE = process.argv.includes("--write");
const STATUS_OUT = resolve(root, "src/data/generated/link-status.json");
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

/** Pull every note link out of the data files, with where it came from. */
function collect() {
  const links = [];

  for (const file of readdirSync(DIR).filter(
    (name) => name.endsWith(".ts") && name !== "index.ts"
  )) {
    const text = readFileSync(resolve(DIR, file), "utf8");
    const entries = text.matchAll(
      /title:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*type:\s*"([^"]*)",\s*\n\s*link:\s*"([^"]*)"/g
    );

    for (const [, title, type, link] of entries) {
      links.push({ file, title, type, link });
    }
  }

  return links;
}

function classifyDrive(response, body) {
  // Drive serves a sign-in interstitial for anything not public.
  if (response.status === 404) return "probably-gone";
  if (response.status === 403) return "needs-auth";
  if (response.url.includes("accounts.google.com")) return "needs-auth";
  if (/Sign in|Request access|You need access/i.test(body)) return "needs-auth";
  if (/(no longer exists|item has been (deleted|removed)|Page not found)/i.test(body)) {
    return "probably-gone";
  }
  if (response.ok) return "ok";
  return "unknown";
}

async function check(entry) {
  if (!entry.link.trim()) return { ...entry, status: "missing" };

  const isDrive = /(drive|docs)\.google\.com/i.test(entry.link);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(entry.link, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        // Drive returns very different bodies to non-browser agents.
        "user-agent":
          "Mozilla/5.0 (compatible; KnotesCentralLinkCheck/1.0; +https://github.com/Developer1010x/knotesneo)",
      },
    });

    const body = isDrive ? (await response.text()).slice(0, 20000) : "";
    const status = isDrive
      ? classifyDrive(response, body)
      : response.status === 404
        ? "dead"
        : response.ok
          ? "ok"
          : "unknown";

    return { ...entry, status, code: response.status };
  } catch (error) {
    return {
      ...entry,
      status: "unreachable",
      code: 0,
      error: error.name === "AbortError" ? "timeout" : error.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function run() {
  const entries = collect();
  const results = [];
  let index = 0;

  async function worker() {
    while (index < entries.length) {
      const entry = entries[index++];
      results.push(await check(entry));
      if (!JSON_OUT && results.length % 20 === 0) {
        process.stderr.write(`  checked ${results.length}/${entries.length}\n`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, entries.length) }, worker)
  );

  const byStatus = results.reduce((counts, result) => {
    counts[result.status] = (counts[result.status] ?? 0) + 1;
    return counts;
  }, {});

  if (WRITE) {
    // Only record verdicts the site should act on. "needs-auth" is the normal,
    // healthy state for RVCE-restricted material and must never be flagged.
    const gone = {};
    for (const result of results) {
      if (["probably-gone", "dead"].includes(result.status) && result.link) {
        gone[result.link] = result.status;
      }
    }
    writeFileSync(
      STATUS_OUT,
      `${JSON.stringify(
        { checkedAt: new Date().toISOString(), gone },
        null,
        2
      )}\n`
    );
    console.log(
      `check-links: recorded ${Object.keys(gone).length} broken links in src/data/generated/link-status.json`
    );
  }

  if (JSON_OUT) {
    writeFileSync(
      resolve(root, "link-report.json"),
      `${JSON.stringify({ checkedAt: new Date().toISOString(), byStatus, results }, null, 2)}\n`
    );
    console.log(JSON.stringify(byStatus, null, 2));
    return;
  }

  console.log("\n=== link check ===");
  for (const [status, count] of Object.entries(byStatus).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`${String(count).padStart(4)}  ${status}`);
  }

  const problems = results.filter((result) =>
    ["dead", "probably-gone", "unreachable", "missing"].includes(result.status)
  );

  if (problems.length) {
    console.log("\nNeeds attention:");
    for (const problem of problems) {
      console.log(
        `  [${problem.status}] ${problem.file}: ${problem.title}\n      ${problem.link || "(no link)"}`
      );
    }
  }

  console.log(
    "\nNote: Drive links shared only with RVCE accounts look identical to deleted ones\n" +
      "from an anonymous check. Verify `needs-auth` entries while signed in.\n"
  );
}

run();
