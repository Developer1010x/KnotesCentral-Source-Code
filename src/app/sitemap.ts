import type { MetadataRoute } from "next";
import { departments } from "@/data/departments";
import { departmentSlug, subjectSlug } from "@/lib/catalog";
import { lastUpdated } from "@/lib/changelog";
import { SITE } from "@/lib/site";

/** Every page, so search engines index subjects individually. */
export default function sitemap(): MetadataRoute.Sitemap {
  const modified = lastUpdated() ? new Date(lastUpdated()!) : new Date();
  const url = (path: string) => `${SITE.url}${path}`;

  const staticPages: MetadataRoute.Sitemap = (
    [
      { url: url("/"), priority: 1, changeFrequency: "weekly" },
      { url: url("/search"), priority: 0.8, changeFrequency: "weekly" },
      { url: url("/whats-new"), priority: 0.7, changeFrequency: "weekly" },
      { url: url("/gaps"), priority: 0.6, changeFrequency: "weekly" },
      { url: url("/contribute"), priority: 0.7, changeFrequency: "monthly" },
      { url: url("/contributors"), priority: 0.5, changeFrequency: "monthly" },
      { url: url("/about"), priority: 0.4, changeFrequency: "yearly" },
      { url: url("/contact"), priority: 0.4, changeFrequency: "yearly" },
      { url: url("/privacy"), priority: 0.2, changeFrequency: "yearly" },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: modified }));

  const catalog: MetadataRoute.Sitemap = departments.flatMap((department) => {
    const slug = departmentSlug(department);

    return [
      {
        url: url(`/${slug}`),
        lastModified: modified,
        priority: 0.9,
        changeFrequency: "weekly" as const,
      },
      ...department.years.flatMap((year) => [
        {
          url: url(`/${slug}/${year.year}`),
          lastModified: modified,
          priority: 0.7,
          changeFrequency: "monthly" as const,
        },
        ...year.semesters.flatMap((semester) => [
          {
            url: url(`/${slug}/${year.year}/${semester.number}`),
            lastModified: modified,
            priority: 0.8,
            changeFrequency: "weekly" as const,
          },
          {
            url: url(`/${slug}/${year.year}/${semester.number}/exam-prep`),
            lastModified: modified,
            priority: 0.6,
            changeFrequency: "monthly" as const,
          },
          ...semester.subjects.map((subject) => ({
            url: url(
              `/${slug}/${year.year}/${semester.number}/${subjectSlug(
                subject,
                semester
              )}`
            ),
            lastModified: modified,
            priority: 0.7,
            changeFrequency: "monthly" as const,
          })),
        ]),
      ]),
    ];
  });

  return [...staticPages, ...catalog];
}
