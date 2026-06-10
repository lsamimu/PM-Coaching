import type { Metadata } from "next";
import { Mail, Calendar, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sammy Lydia at PM Launch Lab — coaching questions, resources, or just to say hi.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Say hi"
        title="Let's talk about your PM journey"
        subtitle="Questions about coaching, resources, or where to start? Drop me a note."
      />

      <Section className="pt-6">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <InfoCard
              icon={<Calendar className="h-5 w-5" />}
              title="Book a discovery call"
              body="The fastest way to get clarity on your path."
              href={site.calendly}
              cta="Open scheduler"
            />
            <InfoCard
              icon={<Mail className="h-5 w-5" />}
              title="Email me"
              body={site.email}
              href={`mailto:${site.email}`}
              cta="Send an email"
            />
            <InfoCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="Connect on LinkedIn"
              body="Follow along for PM tips and open roles."
              href={site.social.linkedin}
              cta="View profile"
            />
          </div>

          <div className="rounded-[2rem] bg-white/80 p-7 shadow-soft ring-1 ring-lavender-100 backdrop-blur sm:p-9">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}

function InfoCard({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 rounded-3xl bg-white/70 p-5 shadow-soft ring-1 ring-lavender-100 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-glow"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lavender-100 text-lavender-600">
        {icon}
      </span>
      <span>
        <span className="block font-bold text-charcoal">{title}</span>
        <span className="block text-sm text-charcoal-soft">{body}</span>
        <span className="mt-1 inline-block text-sm font-semibold text-lavender-600">
          {cta} →
        </span>
      </span>
    </a>
  );
}
