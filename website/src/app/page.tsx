import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Credibility } from "@/components/home/Credibility";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";
import { homeServices } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />
      <Credibility />

      {/* Services preview */}
      <Section>
        <SectionHeading
          eyebrow="How I can help"
          title="Coaching built for aspiring PMs"
          subtitle="For college students, new grads, and career switchers breaking into PM. Pick the focused session that fits where you are."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeServices.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/coaching"
            className="inline-flex items-center gap-2 text-base font-semibold text-lavender-600 hover:gap-3 transition-all"
          >
            See all coaching services <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>

      {/* Newsletter CTA */}
      <Section>
        <Reveal className="mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-lavender-400 via-lavender-500 to-pink-400 px-7 py-12 text-center shadow-glow sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Get PM opportunities &amp; career tips weekly
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Join The PM Launch Letter for open roles, internship roundups, AI
            tools, and honest PM career advice.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
          <p className="mt-4 text-sm text-white/80">
            Free forever. Unsubscribe anytime.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
