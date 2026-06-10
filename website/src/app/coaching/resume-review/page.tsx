import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { ResumeReviewForm } from "@/components/forms/ResumeReviewForm";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/lib/data";

const service = services.find((s) => s.slug === "resume-review")!;

export const metadata: Metadata = {
  title: "Resume Review — Send Your Resume & Book",
  description:
    "Upload your resume and book a PM Resume Review session. Sammy reviews it before your call so you get the most out of your time.",
};

export default function ResumeReviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume Review"
        title="Send your resume, then pick a time"
        subtitle="Share your resume up front so I can review it before we meet — that way our session is all about feedback and next steps, not reading on the spot."
      />

      <Section className="pt-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/coaching"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-600 hover:gap-2.5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to coaching
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Left: what you get */}
            <Reveal>
              <div className="rounded-[2rem] bg-white/70 p-7 shadow-soft ring-1 ring-lavender-100 backdrop-blur">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-lavender-100 to-pink-100 text-2xl">
                  {service.emoji}
                </div>
                <h2 className="mt-5 text-xl font-bold text-charcoal">
                  {service.title} · {service.price}
                </h2>
                <p className="mt-2 text-sm text-charcoal-soft">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {service.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-charcoal">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      {o}
                    </li>
                  ))}
                </ul>

                {service.bonus && (
                  <div className="mt-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-mint-100 to-pink-100 px-4 py-3 ring-1 ring-mint-200">
                    <span className="text-xl">🎁</span>
                    <span className="text-sm font-bold text-charcoal">
                      Bonus: {service.bonus}
                    </span>
                  </div>
                )}

                <div className="mt-6 rounded-2xl bg-lavender-50 p-4 text-sm text-charcoal-soft">
                  <p className="font-semibold text-charcoal">How it works</p>
                  <ol className="mt-2 space-y-1.5">
                    <li>1. Upload your resume + target roles</li>
                    <li>2. Pay securely ($100)</li>
                    <li>3. Pick a time on Calendly</li>
                    <li>4. I review it beforehand &amp; come prepared</li>
                  </ol>
                </div>
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={1}>
              <div className="rounded-[2rem] bg-white/80 p-7 shadow-soft ring-1 ring-lavender-100 backdrop-blur sm:p-9">
                <ResumeReviewForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
