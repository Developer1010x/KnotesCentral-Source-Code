#!/usr/bin/env node
/**
 * Renders the PWA icons from one source description, so the manifest can point
 * at stable file names (Next's generated icon routes are content-hashed).
 */
import { ImageResponse } from "next/og.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const BRAND = "#4f46e5";

function icon(size, maskable) {
  const pad = maskable ? size * 0.14 : 0;
  const radius = maskable ? size / 2 : size * 0.22;

  return {
    type: "div",
    props: {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND,
        borderRadius: maskable ? 0 : radius,
        color: "#fff",
        fontSize: size * (maskable ? 0.42 : 0.5),
        fontWeight: 700,
        letterSpacing: "-0.05em",
        padding: pad,
      },
      children: "K",
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
