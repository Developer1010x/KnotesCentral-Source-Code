"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icons";

/**
 * Share sheet on phones (where juniors actually are), WhatsApp + copy on
 * desktop. The URL is read at click time so it works on any route.
 */
export function ShareButton({
  title,
  text,
  compact = false,
}: {
  title: string;
  text?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = () => (typeof window === "undefined" ? "" : window.location.href);
  const message = `${text ?? title} — ${url()}`;

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: url() });
        return;
      } catch {
        // Cancelled or unsupported — fall through to the manual options.
      }
    }
    setOpen((value) => !value);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={share}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface font-semibold text-fg transition hover:border-brand/40 hover:text-brand ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
        }`}
      >
        <Icon name="share" className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        Share
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border border-line bg-surface p-1 shadow-lift">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg hover:bg-raised"
          >
            <Icon name="share" className="h-4 w-4 text-muted" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-fg hover:bg-raised"
          >
            <Icon
              name={copied ? "check" : "copy"}
              className="h-4 w-4 text-muted"
            />
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
