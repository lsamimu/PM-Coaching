import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "PM Coaching",
  description:
    "1:1 Product Management coaching for aspiring PMs: career clarity, resume reviews (with bonus LinkedIn optimization), and mock interview prep.",
};

const steps = [
  { emoji: "📅", title: "Book a call", body: "Pick a time that works — we'll talk goals and fit." },
  { emoji: "🎯", title: "Get a plan", body: "Leave with a clear, personalized PM action plan." },
  { emoji: "🚀", title: "Launch", body: "Execute with my support until you land the role." },
];

export default function CoachingPage() {
  return (
    <>
      <PageHeader
        eyebrow="1:1 Coaching"
        title="Personalized coaching to launch your PM career"
        subtitle="Whether you need a quick resume fix or full interview prep, there's a session for you. Pay securely, then pick your time."
      />

      <Section className="pt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} detailed />
          ))}
        </div>
      </Section>

      <Section className="bg-white/40 py-16">
        <SectionHeading eyebrow="How it works" title="Three simple steps" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i}>
              <div className="rounded-3xl bg-white/80 p-7 text-center shadow-soft ring-1 ring-lavender-100">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lavender-100 text-2xl">
                  {s.emoji}
                </div>
                <h3 className="mt-4 text-lg font-bold text-charcoal">
                  {i + 1}. {s.title}
                </h3>
                <p className="mt-2 text-sm text-charcoal-soft">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Calendly integration block */}
      <Section>
        <Reveal className="mx-auto max-w-3xl rounded-[2.5rem] bg-gradient-to-br from-lavender-400 to-pink-400 p-8 text-center text-white shadow-glow sm:p-14">
          <Calendar className="mx-auto h-12 w-12" />
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            Book your discovery call
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Free 20-minute call to see if we&apos;re a fit. The scheduler below
            connects to Calendly.
          </p>
          <div className="mt-8">
            <Button href={site.calendly} external size="lg" variant="ghost">
              Open the scheduler →
            </Button>
          </div>
          {/*
            To embed Calendly inline instead, drop this where you want it:
            <div className="calendly-inline-widget" data-url={site.calendly} style={{minWidth:320,height:700}} />
            and add the Calendly script via next/script.
          */}
        </Reveal>
      </Section>
    </>
  );
}
