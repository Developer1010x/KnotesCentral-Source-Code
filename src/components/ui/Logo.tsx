import { PAGE_LEFT, PAGE_LENGTH, PAGE_RIGHT, RIBBON, SPINE } from "@/lib/logo";

/**
 * The KnotesNeo mark as live SVG.
 *
 * It animates twice, and both are pure CSS so this stays a server component:
 * the pages draw themselves in and the ribbon drops on mount, then hovering
 * the mark opens the book a little — each page swings on the spine, which is
 * why every page carries `transform-origin: 16px 10px` via `.logo-page`.
 * `prefers-reduced-motion` is already collapsed site-wide in `globals.css`,
 * and every animation is `both`, so a reduced-motion visitor lands straight
 * on the finished frame rather than on a blank tile.
 */
export function Logo({
  className = "h-9 w-9",
  animated = true,
  title,
}: {
  className?: string;
  animated?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`${animated ? "logo" : ""} ${className}`}
      fill="none"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g className="logo-page logo-page-left" stroke="currentColor">
        <path d={PAGE_LEFT} pathLength={PAGE_LENGTH} />
      </g>
      <g className="logo-page logo-page-right" stroke="currentColor">
        <path d={PAGE_RIGHT} pathLength={PAGE_LENGTH} />
      </g>
      <path className="logo-spine" d={SPINE} stroke="currentColor" />
      <path className="logo-ribbon" d={RIBBON} stroke="rgb(var(--accent))" />
    </svg>
  );
}
