/**
 * The mark, for build scripts.
 *
 * `src/lib/logo.ts` is the same renderer for the app; both read the geometry
 * from `src/lib/logo-paths.json`, so there is one copy of the artwork.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const paths = JSON.parse(
  readFileSync(resolve(here, "../src/lib/logo-paths.json"), "utf8")
);

export function markSvg({
  size = 32,
  tile = paths.brand,
  stroke = "#fff",
  ribbon = paths.ribbonColour,
  radius = 7,
  padding = 0,
} = {}) {
  const scale = (32 - padding * 2) / 32;
  const stroked = (d, colour) => `<path d="${d}" stroke="${colour}"/>`;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">`,
    tile ? `<rect width="32" height="32" rx="${radius}" fill="${tile}"/>` : "",
    `<g transform="translate(${padding} ${padding}) scale(${scale})" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">`,
    stroked(paths.pageLeft, stroke),
    stroked(paths.pageRight, stroke),
    stroked(paths.spine, stroke),
    stroked(paths.ribbon, ribbon),
    `</g></svg>`,
  ].join("");
}

export const markDataUri = (options) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(markSvg(options))}`;
