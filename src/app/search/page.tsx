import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search every RVCE subject on KnotesNeo by name, subject code or note title.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-12 w-full max-w-xl" />
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
