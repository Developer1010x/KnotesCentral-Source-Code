import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What KnotesNeo does and does not collect, and how third-party links are handled.",
};

export default function Privacy() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        trail={[{ label: "Departments", href: "/" }, { label: "Privacy" }]}
      />

      <div className="prose-page">
        <h2>Information collection and use</h2>
        <p>
          KnotesNeo is committed to protecting your privacy. We do not
          collect any personal information unless you explicitly provide it
          through our contact forms. Anything collected is used solely to
          improve the service and respond to your enquiry.
        </p>

        <h2>Data storage and security</h2>
        <p>
          All study materials hosted here are educational content shared with
          the RVCE community. We apply standard security measures to protect the
          site from unauthorised access or misuse.
        </p>

        <h2>Third-party services</h2>
        <p>
          We use third-party services to host documents and collect feedback —
          principally Google Drive, Google Docs and GitHub. Those services have
          their own privacy policies, which we encourage you to review. External
          links are provided as-is; we are not responsible for the content or
          privacy practices of external sites.
        </p>

        <h2>Updates to this policy</h2>
        <p>
          We may update this policy at any time. Changes take effect as soon as
          they are posted to this page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? <Link href="/contact">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}
