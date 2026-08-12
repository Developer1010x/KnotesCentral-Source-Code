import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Icon name="clock" className="h-6 w-6" />
      </div>
      <h1 className="text-display-sm font-bold text-fg">You are offline</h1>
      <p className="mt-3 text-[0.975rem] leading-7 text-muted">
        Pages you have already opened still work. Anything new — and every note
        itself, since those live on Drive and GitHub — needs a connection.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/saved"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-contrast hover:opacity-90"
        >
          <Icon name="bookmarkFilled" className="h-4 w-4" />
          Your saved notes
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg hover:border-brand/40 hover:text-brand"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
