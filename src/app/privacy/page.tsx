import Link from "next/link";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="max-w-3xl mx-auto space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-3">
            Information Collection and Use
          </h2>
          <p>
            Knotes Central is committed to protecting your privacy. We do not
            collect any personal information unless explicitly provided by you
            through our contact forms. Any information collected is used solely
            for the purpose of improving our services and responding to your
            inquiries.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Data Storage and Security</h2>
          <p>
            All study materials and resources hosted on Knotes Central are
            publicly available educational content. We implement standard
            security measures to protect our website from unauthorized access or
            misuse.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Third-Party Services</h2>
          <p>
            We may use third-party services for hosting documents and collecting
            feedback. These services have their own privacy policies, and we
            encourage users to review them. Links to external resources are
            provided as-is, and we are not responsible for the content or
            privacy practices of external sites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Updates to Privacy Policy</h2>
          <p>
            We reserve the right to update this privacy policy at any time.
            Changes will be effective immediately upon posting to this page. We
            encourage users to periodically review this page for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
          <p>
            If you have any questions about our privacy policy, please{" "}
            <Link
              href="/contact"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              contact us
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
