import { recentNotes } from "@/lib/changelog";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** RSS of newly added material, for anyone who wants updates without checking. */
export function GET() {
  const items = recentNotes(50)
    .map((item) => {
      const link = `${SITE.url}${item.path}`;
      const where = `${item.location.department.name} · Year ${item.location.year.year} · Semester ${item.location.semester.number}`;

      return `    <item>
      <title>${escape(item.note.title)} — ${escape(item.location.subject.name)}</title>
      <link>${escape(link)}</link>
      <guid isPermaLink="false">${escape(item.note.link)}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escape(where)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(SITE.name)} — what's new</title>
    <link>${SITE.url}</link>
    <description>${escape(SITE.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
