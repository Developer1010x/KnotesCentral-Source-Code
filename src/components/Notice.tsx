"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useStored } from "@/lib/prefs";
import { SITE_NOTICE } from "@/lib/site";

/**
 * Site-wide announcement. Dismissal is remembered per notice id, so changing
 * the id in lib/site.ts shows it again to everyone — including people who
 * dismissed the previous one.
 */
export function Notice() {
  const { value: dismissed, setValue: setDismissed, hydrated } = useStored<
    string[]
  >("knotes:dismissed-notices", []);

  const notice = SITE_NOTICE;
  if (!notice) return null;
  if (hydrated && dismissed.includes(notice.id)) return null;

  return (
    <div className="border-b border-paper/30 bg-paper/10">
      <div className="container flex items-start gap-3 py-3">
        <span className="mt-0.5 shrink-0 text-paper">
          <Icon name="inbox" className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold text-fg">{notice.title}</p>
          <p className="mt-0.5 leading-6 text-muted">{notice.body}</p>
          {notice.href && (
            <Link
              href={notice.href}
              className="mt-1 inline-flex items-center gap-1 font-medium text-brand hover:underline"
            >
              {notice.linkLabel ?? "More"}
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed([...dismissed, notice.id])}
          className="shrink-0 rounded-md p-1.5 text-muted hover:bg-raised hover:text-fg"
          aria-label="Dismiss this notice"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
