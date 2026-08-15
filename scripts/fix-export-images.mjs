#!/usr/bin/env node
/**
 * Gives the exported Open Graph images a file extension.
 *
 * `next build` with `output: "export"` writes each metadata image route as an
 * extensionless file — out/cse-ise-aiml/2/3/dms/opengraph-image — and a static
 * host has no way to know that is a PNG, so it serves it as a download and
 * every WhatsApp / Twitter / Slack preview of a shared subject link breaks.
 *
 * This renames each one to <name>.png and rewrites the references in the
 * exported HTML and RSC payloads to match. Runs as `postbuild`.
 */
import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(root, "out");

/** Metadata image routes Next generates without an extension. */
const IMAGE_ROUTES = /^(opengraph-image|twitter-image)(-[\w-]+)?$/;
const REWRITABLE = /\.(html|txt|json|xml)$/;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

let out;
try {
  out = walk(OUT);
} catch {
  console.log("fix-export-images: no out/ directory — nothing to do.");
  process.exit(0);
}

const renamed = [];

for (const file of out) {
  const name = file.slice(file.lastIndexOf("/") + 1);
  if (!IMAGE_ROUTES.test(name)) continue;

  // Only touch it if it really is a PNG; ImageResponse could be swapped later.
  const head = readFileSync(file).subarray(0, 4);
  if (!head.equals(PNG_MAGIC)) continue;

  renameSync(file, `${file}.png`);
  renamed.push(name);
}

if (renamed.length === 0) {
  console.log("fix-export-images: no extensionless metadata images found.");
  process.exit(0);
}

// The generated markup points at "…/opengraph-image?<hash>"; every reference is
// followed by a query string or a closing quote, which is what anchors this.
const reference = /(opengraph-image|twitter-image)(?=[?"'\\])/g;
let patched = 0;

for (const file of out) {
  if (!REWRITABLE.test(file)) continue;
  const text = readFileSync(file, "utf8");
  if (!reference.test(text)) continue;
  reference.lastIndex = 0;
  writeFileSync(file, text.replace(reference, "$1.png"));
  patched += 1;
}

console.log(
  `fix-export-images: renamed ${renamed.length} metadata images and updated ${patched} files.`
);
