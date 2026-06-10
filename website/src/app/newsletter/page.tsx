import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "The PM Launch Letter",
  description:
    "Weekly PM opportunities, internship roundups, AI tools, and career advice for aspiring Product Managers. Free newsletter.",
};

const topics = [
  { emoji: "📬", title: "Open PM Roles", body: "Curated internships & full-time PM jobs, fresh each week." },
  { emoji: "🎓", title: "Internship Roundups", body: "The best PM internships before they fill up." },
  { emoji: "🤖", title: "AI Tools", body: "The AI tools and prompts smart PMs are using right now." },
  { emoji: "💡", title: "PM Career Advice", body: "Honest, practical tips to break into Product Management." },
];

export default function NewsletterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free weekly newsletter"
        title="The PM Launch Letter"
        subtitle="Open PM roles, internship roundups, AI tools, and career advice — delivered weekly to aspiring PMs."
      />

      <Section className="pt-6">
        <Reveal className="mx-auto max-w-2xl rounded-[2.5rem] bg-gradient-to-br from-lavender-400 via-lavender-500 to-pink-400 px-7 py-12 text-center shadow-glow sm:px-12">
          <p className="text-5xl">💌</p>
          <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
            Join the community of future PMs
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">
            One email a week. No spam, ever. Unsubscribe anytime.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          {topics.map((t, i) => (
            <Reveal key={t.title} delay={i}>
              <div className="flex items-start gap-4 rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-lavender-100 backdrop-blur">
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <h3 className="font-bold text-charcoal">{t.title}</h3>
                  <p className="mt-1 text-sm text-charcoal-soft">{t.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-sm text-charcoal-soft">
          Powered by your choice of ConvertKit or Beehiiv — wire up the API key
          in <code className="rounded bg-white/70 px-1">.env</code> to go live.
        </p>
      </Section>
    </>
  );
}
