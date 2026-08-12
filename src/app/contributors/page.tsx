import type { Metadata } from "next";
import { contributors } from "@/data/contributors";
import ContributorCard from "@/components/ContributorCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/Card";
import { AddNotesButton } from "@/components/ContributeCTA";

export const metadata: Metadata = {
  title: "Contributors",
  description:
    "The RVCE students who collected, uploaded and maintain the notes on Knotes Central.",
};

export default function ContributorsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Credits"
        title="Contributors"
        description={`${contributors.length} students have added notes, maintained the drives or built this site. If you upload something, your name belongs here too.`}
        trail={[{ label: "Departments", href: "/" }, { label: "Contributors" }]}
      >
        <AddNotesButton label="Add your contribution" />
      </PageHeader>

      <CardGrid>
        {contributors.map((contributor) => (
          <ContributorCard
            key={`${contributor.name}-${contributor.department}-${contributor.year}`}
            contributor={contributor}
          />
        ))}
      </CardGrid>
    </div>
  );
}
