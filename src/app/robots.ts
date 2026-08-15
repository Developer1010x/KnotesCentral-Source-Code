import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/* A static export has no server to run this on request. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/saved", "/offline"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
