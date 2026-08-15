import { SITE, asset } from "@/lib/site";

/* A static export has no server to run this on request. */
export const dynamic = "force-static";

/**
 * The PWA manifest.
 *
 * It is a route rather than a file in `public/` because every path inside it
 * has to carry the deploy's base path — GitHub Pages serves the site from a
 * repository sub-path, and a `start_url` of "/" would open the wrong site.
 *
 * It is deliberately *not* `app/manifest.ts`: Next treats that filename as
 * file-based metadata and emits `<link rel="manifest" href="/manifest.webmanifest">`
 * with no base path, which 404s on a project Pages site.
 */
export function GET() {
  const manifest = {
    name: `${SITE.name} — RVCE notes`,
    short_name: SITE.name,
    description:
      "Notes, lab manuals and question papers for RVCE, in one place.",
    start_url: asset("/"),
    scope: asset("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    categories: ["education", "books"],
    icons: [
      {
        src: asset("/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: asset("/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: asset("/icon-maskable.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Search subjects", url: asset("/search") },
      { name: "Saved", url: asset("/saved") },
      { name: "Contribute", url: asset("/contribute") },
    ],
  };

  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: {
      "content-type": "application/manifest+json; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
