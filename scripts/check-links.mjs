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
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(root, "src/data/departments");
const JSON_OUT = process.argv.includes("--json");
const WRITE = process.argv.includes("--write");
const STATUS_OUT = resolve(root, "src/data/generated/link-status.json");
const HISTORY_OUT = resolve(root, "src/data/generated/link-history.json");
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

const DEAD_VERDICTS = ["probably-gone", "dead"];

/**
 * The site only ever knew *that* a link was broken, never since when — each run
 * overwrote the last. This keeps the time series instead: one record per check,
 * and per link the date it was first seen dead, so a note can say "dead since
 * March" and /rot can show whether the rot is getting worse.
 *
 * The first run of a repository that already has a link-status.json is seeded
 * from that snapshot, so the history starts at the date of the real check that
 * produced it rather than pretending the damage happened today.
 */
function loadHistory() {
  if (existsSync(HISTORY_OUT)) {
    try {
      const parsed = JSON.parse(readFileSync(HISTORY_OUT, "utf8"));
      return {
        runs: Array.isArray(parsed.runs) ? parsed.runs : [],
        links: parsed.links && typeof parsed.links === "object" ? parsed.links : {},
      };
    } catch {
      console.warn(
        "check-links: link-history.json is not valid JSON — starting a new history."
      );
    }
  }

  const history = { runs: [], links: {} };
  if (!existsSync(STATUS_OUT)) return history;

  try {
    const snapshot = JSON.parse(readFileSync(STATUS_OUT, "utf8"));
    const checkedAt = snapshot.checkedAt;
    const gone = snapshot.gone ?? {};
    if (!checkedAt) return history;

    history.runs.push({
      checkedAt,
      gone: Object.keys(gone).length,
      seeded: true,
    });
    for (const [link, status] of Object.entries(gone)) {
      history.links[link] = { status, firstDead: checkedAt, lastDead: checkedAt };
    }
    console.log(
      `check-links: seeded the history from the ${checkedAt.slice(0, 10)} snapshot.`
    );
  } catch {
    console.warn("check-links: could not read link-status.json — history starts empty.");
  }

  return history;
}

/**
 * One record per resource, not per note: a Drive folder listed under two
 * departments is one link, and counting it twice would inflate every number on
 * the rot report. Notes with no link at all stay separate — each is a real gap.
 */
function uniqueResources(results) {
  const seen = new Set();
  return results.filter((result) => {
    const key = result.link || `unlinked:${result.file}:${result.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function updateHistory(history, allResults, checkedAt) {
  const results = uniqueResources(allResults);

  for (const result of results) {
    if (!result.link) continue;
    const dead = DEAD_VERDICTS.includes(result.status);
    const record = history.links[result.link];

    if (dead) {
      if (record) {
        record.status = result.status;
        record.lastDead = checkedAt;
        // It was back at some point and has died again; the run history keeps
        // the full story, so only the current spell is tracked here.
        if (record.recoveredAt) {
          record.firstDead = checkedAt;
          delete record.recoveredAt;
        }
      } else {
        history.links[result.link] = {
          status: result.status,
          firstDead: checkedAt,
          lastDead: checkedAt,
        };
      }
    } else if (record && !record.recoveredAt) {
      // Someone re-uploaded it, or the check was wrong the first time.
      record.recoveredAt = checkedAt;
    }
  }

  const previous = history.runs[history.runs.length - 1];
  if (!previous || previous.checkedAt !== checkedAt) {
    history.runs.push({
      checkedAt,
      checked: results.length,
      gone: results.filter((result) => DEAD_VERDICTS.includes(result.status))
        .length,
      byStatus: results.reduce((counts, result) => {
        counts[result.status] = (counts[result.status] ?? 0) + 1;
        return counts;
      }, {}),
    });
  }

  history.runs.sort((a, b) => a.checkedAt.localeCompare(b.checkedAt));
  writeFileSync(HISTORY_OUT, `${JSON.stringify(history, null, 2)}\n`);

  return history;
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
    const checkedAt = new Date().toISOString();
    // Read the history — or seed it from the previous snapshot — *before* that
    // snapshot is overwritten, or the seed would just duplicate this run.
    const history = loadHistory();

    // Only record verdicts the site should act on. "needs-auth" is the normal,
    // healthy state for RVCE-restricted material and must never be flagged.
    const gone = {};
    for (const result of results) {
      if (DEAD_VERDICTS.includes(result.status) && result.link) {
        gone[result.link] = result.status;
      }
    }
    writeFileSync(STATUS_OUT, `${JSON.stringify({ checkedAt, gone }, null, 2)}\n`);
    console.log(
      `check-links: recorded ${Object.keys(gone).length} broken links in src/data/generated/link-status.json`
    );

    updateHistory(history, results, checkedAt);
    console.log(
      `check-links: history now holds ${history.runs.length} check${
        history.runs.length === 1 ? "" : "s"
      } and ${Object.keys(history.links).length} links that have been broken.`
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
