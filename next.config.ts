import type { NextConfig } from "next";

/**
 * The site is a static export published to GitHub Pages, which serves a
 * project site from a repository sub-path (…github.io/<repo>). The deploy
 * workflow passes that sub-path in; a local build gets "" and serves from the
 * root, so `npm run dev` and `npx serve out` both work unchanged.
 *
 * GitHub Pages returns "/" as the base path for a user/org site — Next rejects
 * that, so it is normalised to "" here.
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Everything the site shows is known at build time; there is no server.
  output: "export",
  basePath,
  // A static host has no rewrite layer, so /gaps has to exist on disk as
  // gaps/index.html rather than gaps.html.
  trailingSlash: true,
  // The image optimiser needs a running server, which an export does not have.
  images: { unoptimized: true },
};

export default nextConfig;
