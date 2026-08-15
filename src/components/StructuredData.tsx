import { SITE } from "@/lib/site";

/**
 * JSON-LD for search results. Breadcrumbs make Google show the department →
 * year → semester trail instead of a bare URL, which is what juniors recognise.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function breadcrumbLd(trail: Array<{ label: string; href?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${SITE.url}${crumb.href}` } : {}),
    })),
  };
}

export function courseLd({
  name,
  code,
  description,
  path,
  department,
}: {
  name: string;
  code?: string;
  description: string;
  path: string;
  department: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: `${SITE.url}${path}`,
    ...(code ? { courseCode: code } : {}),
    provider: {
      "@type": "CollegeOrUniversity",
      name: "RV College of Engineering",
      department: { "@type": "Organization", name: department },
    },
    isAccessibleForFree: true,
    inLanguage: "en",
  };
}

export function siteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
