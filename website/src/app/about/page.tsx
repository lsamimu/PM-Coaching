import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { aboutTimeline } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind PM Launch Lab — how Sammy Lydia broke into Product Management and why she's helping the next wave of aspiring PMs.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="My story"
        title="From aspiring PM to your PM coach"
        subtitle="I built PM Launch Lab to be the warm, practical guide I wish I'd had breaking into Product Management."
      />

      <Section className="pt-8">
        <div className="relative mx-auto max-w-3xl">
          {/* vertical line */}
          <div
            aria-hidden
            className="absolute left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-lavender-300 via-pink-300 to-mint-300 sm:left-1/2"
          />
          <ol className="space-y-10">
            {aboutTimeline.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i}>
                <div
                  className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* node */}
                  <div className="absolute left-6 -translate-x-1/2 sm:left-1/2">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-soft ring-4 ring-lavender-100">
                      {item.emoji}
                    </div>
                  </div>
                  <div
                    className={`ml-16 rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-lavender-100 backdrop-blur sm:ml-0 sm:w-[calc(50%-3rem)] ${
                      i % 2 === 0 ? "sm:mr-auto sm:text-right" : "sm:ml-auto"
                    }`}
                  >
                    <span className="text-sm font-bold text-lavender-500 font-[family-name:var(--font-accent)]">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-charcoal-soft">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="mx-auto mt-16 max-w-2xl rounded-[2rem] bg-gradient-to-br from-mint-100 to-lavender-100 p-8 text-center shadow-soft sm:p-12">
          <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
            Ready to write your own PM story?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-charcoal-soft">
            Let&apos;s map your path in a free discovery call — no pressure, just
            clarity.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={site.calendly} external size="lg">
              Book a Discovery Call
            </Button>
            <Button href="/coaching" variant="ghost" size="lg">
              View coaching
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
