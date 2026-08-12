import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon, type IconName } from "@/components/ui/icons";
import {
  CONTACT_EMAIL,
  CONTACT_FORM_URL,
  REDDIT,
  addNotesIssueUrl,
  reportIssueUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions, corrections or notes to contribute — how to reach the Knotes Central maintainers.",
};

const CHANNELS: Array<{
  icon: IconName;
  title: string;
  body: string;
  href: string;
  cta: string;
}> = [
  {
    icon: "sparkles",
    title: "Add notes",
    body: "Paste a Drive or GitHub link into a short form. A maintainer puts it on the site.",
    href: addNotesIssueUrl(),
    cta: "Open the form",
  },
  {
    icon: "inbox",
    title: "Report a broken link",
    body: "A note that will not open, or points at the wrong material.",
    href: reportIssueUrl(),
    cta: "Report it",
  },
  {
    icon: "check",
    title: "Anything else",
    body: "Requests, corrections and general feedback through our form.",
    href: CONTACT_FORM_URL,
    cta: "Open the form",
  },
  {
    icon: "mail",
    title: "Email",
    body: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    cta: "Send an email",
  },
  {
    icon: "users",
    title: "Reddit",
    body: "Ask the wider RVCE community on r/rvce, or follow r/KnotesCentral for updates.",
    href: REDDIT.knotes,
    cta: "Open r/KnotesCentral",
  },
];

export default function Contact() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        description="Broken link, missing subject, or notes you want to add? Any of these reach us."
        trail={[{ label: "Departments", href: "/" }, { label: "Contact" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {CHANNELS.map((channel) => (
          <a
            key={channel.title}
            href={channel.href}
            target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="card-interactive group flex flex-col p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <Icon name={channel.icon} className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-fg group-hover:text-brand">
              {channel.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">{channel.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
              {channel.cta}
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
              />
            </span>
          </a>
        ))}
      </div>

      <p className="text-sm text-muted">
        Most notes live on RVCE Workspace Drive, so you may need to be signed in
        with your college account to open them.
      </p>
    </div>
  );
}
