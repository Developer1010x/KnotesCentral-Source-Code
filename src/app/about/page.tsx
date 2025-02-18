import React from "react";
import Link from "next/link";
export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Knotes Central</h1>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Knotes Central is a comprehensive collection of academic resources for
        RVCE. Our mission is to provide students with easy access to a wide
        range of study materials, including notes, question papers, and lab
        manuals, to help them excel in their academic pursuits. Our main Motto ,{" "}
        <i>&quot;For all For Always!&quot;</i>
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Knotes Central aims to offer a comprehensive method of accessing
          notes, ensuring our community members no longer need to search
          extensively for study materials. All documents and notes are
          exclusively from RVCE, making this a centralized resource for our
          students.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Wide range of courses covered</li>
          <li>Easy access to notes and question papers</li>
          <li>Accessible via RVCE Email ID</li>
          <li>No running around for notes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">How to Access</h2>
        <p className="text-gray-700 dark:text-gray-300">
          All notes are stored in RVCE Workspace Drive, requiring login to view
          the content.But sometimes made public for beta versions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Declaration</h2>
        <p className="text-gray-700 dark:text-gray-300">
          This website is intended exclusively for RVCE students and is not
          accessible to individuals outside this community. We declare that its
          use is free and fair, strictly for educational purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Continuous Updates and Contributions
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This website connects to shared drives where all the notes, previous
          years&apos; question papers, and other resources are stored. As we
          near graduation, we want to ensure that this resource remains valuable
          and up-to-date for future batches.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Batch Contributions</h3>
            <p className="text-gray-700 dark:text-gray-300">
              After we graduate, we encourage our batch mates, as well as
              juniors, to continue updating the drives with new notes and
              resources. This collaborative effort will benefit everyone.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">List of Contributors</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We maintain a list of contributors who have editor access to the
              drive. If you need to update the content, please contact the
              nearest senior or junior from this list to gain editor access. The
              list will be regularly updated to reflect active contributors.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How to Contribute</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Contact Us:</strong> To become a contributor, reach out
                to a current contributor from the list. They will guide you on
                gaining editor access and the guidelines for updating the
                content.
              </li>
              <li>
                <strong>Add New Content:</strong> When adding new content,
                please follow the existing structure to maintain consistency.
                Label your notes and resources clearly with course names and
                relevant details.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Additional Notes</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Feel free to clone the drive (whose link will be in the sheet) and
          create your own if the website is not updated. Additionally, you can
          clone the website too. This project is still in its early stages and
          has a long way to go. We are looking for your contributions to make
          this project better.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">Previous Versions</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          As we continue to improve the Knotes Central platform, we have had
          several iterations. Below are links to the previous versions for your
          reference:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Version 1:</strong>{" "}
            <Link
              href="https://developer1100x.github.io/KnotesCentralV1.0/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Knotes Central V1.0
            </Link>
          </li>
          <li>
            <strong>Version 2:</strong>{" "}
            <Link
              href="https://developer1010x.github.io/KnotesCentral/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Knotes Central V2
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300">
          If you have any questions, suggestions, or feedback, please feel free
          to{" "}
          <Link
            href="/contact"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            contact us
          </Link>
          . We are always looking for ways to improve and would love to hear
          from you.
        </p>
      </section>
    </div>
  );
}
