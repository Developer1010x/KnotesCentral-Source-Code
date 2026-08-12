#!/usr/bin/env node
/**
 * Derives "when was this note added" from git history, so the What's New feed
 * needs no manual bookkeeping — the commit that first introduced a link is its
 * publication date.
 *
 * Writes src/data/generated/added.json: { [note link]: ISO date }.
 * Degrades to an empty map when git history is unavailable (shallow CI clones),
 * which simply means nothing is badged as new.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(root, "src/data/generated/added.json");

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 64 << 20 });

const isDataFile = (path) =>
  path.startsWith("src/data/") && path.endsWith(".ts");

const LINK = /link:\s*"([^"]+)"/g;

function linksIn(text) {
  return new Set(Array.from(text.matchAll(LINK), (match) => match[1]));
}

function build() {
  const log = git(
    "log",
    "--reverse",
    "--format=%H\t%cI",
    "--",
    "src/data"
  ).trim();

  if (!log) return {};

  const added = {};
  const seen = new Set();

  for (const line of log.split("\n")) {
    const [sha, date] = line.split("\t");

    const files = git("ls-tree", "-r", "--name-only", sha)
      .split("\n")
      .filter(isDataFile);

    for (const file of files) {
      let contents = "";
      try {
        contents = git("show", `${sha}:${file}`);
      } catch {
        continue;
      }

      for (const link of linksIn(contents)) {
        if (seen.has(link)) continue;
        seen.add(link);
        added[link] = date;
      }
    }
  }

  return added;
}

let added = {};
try {
  added = build();
  console.log(
    `build-changelog: dated ${Object.keys(added).length} links from git history`
  );
} catch (error) {
  console.warn(
    `build-changelog: no git history available (${error.message.split("\n")[0]}) — What's New will be empty`
  );
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(added, null, 2)}\n`);
