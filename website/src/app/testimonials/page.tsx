import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { Reveal } from "@/components/motion/Reveal";
import { LinkedInIcon } from "@/components/ui/BrandIcons";
import { testimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reviews & Feedback",
  description:
    "Share your experience with PM Launch Lab. Featured reviews from students, new grads, and career switchers who broke into Product Management.",
};

export default function ReviewsPage() {
  const hasReviews = testimonials.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="Worked with me? Share your experience"
        subtitle="Your honest feedback helps me improve and helps the next aspiring PM decide. Featured reviews appear here once approved."
      />

      <Section className="pt-6">
        {hasReviews ? (
          <>
            <TestimonialsCarousel items={testimonials} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i}>
                  <figure className="flex h-full flex-col rounded-3xl bg-white/80 p-7 shadow-soft ring-1 ring-lavender-100 backdrop-blur">
                    {t.outcome && (
                      <span className="mb-3 inline-block w-fit rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-emerald">
                        {t.outcome}
                      </span>
                    )}
                    <blockquote className="flex-1 text-charcoal">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-lavender-200 to-pink-200 font-bold text-white">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-charcoal">{t.name}</p>
                        <p className="text-sm text-charcoal-soft">{t.role}</p>
                      </div>
                      {t.linkedin && (
                        <a
                          href={t.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t.name} on LinkedIn`}
                          className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-lavender-50 text-lavender-500 hover:bg-lavender-100"
                        >
                          <LinkedInIcon className="h-4 w-4" />
                        </a>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
                ))}
              </div>
          </>
        ) : (
          <Reveal className="mx-auto max-w-2xl rounded-[2rem] bg-white/70 p-8 text-center shadow-soft ring-1 ring-lavender-100 sm:p-10">
            <p className="text-5xl">🌱</p>
            <h2 className="mt-4 text-2xl font-bold text-charcoal">
              Reviews are on the way
            </h2>
            <p className="mx-auto mt-2 max-w-md text-charcoal-soft">
              I&apos;m just getting started and gathering honest feedback from the
              people I work with. If that&apos;s you, I&apos;d love to hear how it
              went.
            </p>
          </Reveal>
        )}

        {/* Feedback form */}
        <div className="mx-auto mt-14 max-w-2xl">
          <div className="rounded-[2rem] bg-white/80 p-7 shadow-soft ring-1 ring-lavender-100 backdrop-blur sm:p-9">
            <h2 className="text-xl font-bold text-charcoal">
              Leave a rating &amp; feedback
            </h2>
            <p className="mt-1 text-sm text-charcoal-soft">
              Takes a minute. It goes straight to me — nothing is posted publicly
              unless I feature it.
            </p>
            <div className="mt-6">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
