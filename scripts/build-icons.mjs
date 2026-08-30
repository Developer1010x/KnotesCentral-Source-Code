#!/usr/bin/env node
/**
 * Renders the PWA icons from one source description, so the manifest can point
 * at stable file names (Next's generated icon routes are content-hashed).
 */
import { ImageResponse } from "next/og.js";
import { markDataUri } from "./logo-mark.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Satori has no `<svg>` element, so the mark goes in as an `<img>` carrying a
 * data URI — `markSvg` renders the same paths the site does.
 *
 * A maskable icon is squared off and padded: the launcher applies its own
 * mask, and anything inside the safe area is what survives it.
 */
function icon(size, maskable) {
  return {
    type: "img",
    props: {
      width: size,
      height: size,
      src: markDataUri({
        size,
        radius: maskable ? 0 : 32 * 0.22,
        padding: maskable ? 32 * 0.14 : 32 * 0.16,
      }),
    },
  };
}

const TARGETS = [
  ["public/icon-192.png", 192, false],
  ["public/icon-512.png", 512, false],
  ["public/icon-maskable.png", 512, true],
  ["public/apple-icon.png", 180, false],
];

for (const [file, size, maskable] of TARGETS) {
  const response = new ImageResponse(icon(size, maskable), {
    width: size,
    height: size,
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  const out = resolve(root, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, buffer);
  console.log(`build-icons: ${file} (${buffer.length} bytes)`);
}
