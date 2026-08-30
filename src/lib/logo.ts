/**
 * The KnotesNeo mark, in one place.
 *
 * An open book drawn as two monoline pages hinged on a shared spine, with a
 * bookmark ribbon tucked into the right page — the ribbon is what makes it
 * ours rather than a stock book glyph, so it is always the accent colour.
 *
 * Everything is authored on a 32×32 grid and mirrored about `x = 16`, so the
 * mark stays balanced at 20px in the header and at 512px in the PWA icon.
 * `Logo.tsx` renders these paths as live SVG; `markSvg()` renders the same
 * geometry to a string for the places that can only take an image (Satori has
 * no `<svg>` element, so the OG card and `build-icons` embed a data URI).
 */

import paths from "./logo-paths.json";

/**
 * The geometry itself lives in `logo-paths.json` so `scripts/build-icons.mjs`
 * — plain node ESM, with no TypeScript loader — can read the same four paths
 * instead of carrying a copy that drifts.
 */

/** Left page: spine → top edge → outer board → bottom edge → back to spine. */
export const PAGE_LEFT = paths.pageLeft;

/** Right page: the same curve mirrored, so the two halves read as one sheet. */
export const PAGE_RIGHT = paths.pageRight;

/** The spine the two pages hinge on, and the axis the mark is mirrored about. */
export const SPINE = paths.spine;

/** Bookmark ribbon, notched at the foot, hanging inside the right page. */
export const RIBBON = paths.ribbon;

/** Total length of each page path, for the draw-on `stroke-dasharray`. */
export const PAGE_LENGTH = 46;

export const BRAND = paths.brand;
// teal-300, not the teal-600 `--accent`: the tile is indigo, and the darker
// token goes muddy on it. In-app the mark sits on the page, and uses --accent.
export const RIBBON_COLOUR = paths.ribbonColour;

/**
 * The mark as a standalone SVG string.
 *
 * `tile` fills a rounded square behind it (the icon and OG treatments); the
 * favicon passes `radius` explicitly because a maskable icon is squared off
 * and the platform applies its own mask.
 */
export function markSvg({
  size = 32,
  tile = BRAND,
  stroke = "#fff",
  ribbon = RIBBON_COLOUR,
  radius = 7,
  padding = 0,
}: {
  size?: number;
  tile?: string | null;
  stroke?: string;
  ribbon?: string;
  radius?: number;
  padding?: number;
} = {}) {
  // Padding shrinks the artwork inside the tile rather than the tile itself,
  // which is what a maskable icon needs — the tile must stay full-bleed.
  const scale = (32 - padding * 2) / 32;
  const glyph = `<g transform="translate(${padding} ${padding}) scale(${scale})" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${PAGE_LEFT}" stroke="${stroke}"/><path d="${PAGE_RIGHT}" stroke="${stroke}"/><path d="${SPINE}" stroke="${stroke}"/><path d="${RIBBON}" stroke="${ribbon}"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">${
    tile ? `<rect width="32" height="32" rx="${radius}" fill="${tile}"/>` : ""
  }${glyph}</svg>`;
}

/** The same mark as a `data:` URI, for `<img>`-only renderers like Satori. */
export const markDataUri = (options?: Parameters<typeof markSvg>[0]) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(markSvg(options))}`;
