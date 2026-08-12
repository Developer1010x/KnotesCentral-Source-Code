"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icons";

/**
 * Copies every resource link in one go — for pasting into a batch WhatsApp
 * group, which is how these actually travel.
 */
export function CopyLinks({
  items,
  label = "Copy all links",
}: {
  items: { title: string; link: string }[];
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const usable = items.filter((item) => item.link.trim());

  if (!usable.length) return null;

  const copy = async () => {
    const text = usable
      .map((item) => `${item.title}\n${item.link}`)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg transition hover:border-brand/40 hover:text-brand"
    >
      <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
      {copied ? `${usable.length} links copied` : label}
    </button>
  );
}
