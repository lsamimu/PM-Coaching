import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { BlogList } from "@/components/BlogList";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { posts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "PM career advice, AI for PMs, resume tips, interview prep, and lessons from Microsoft — written for aspiring Product Managers.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="The PM Launch Blog"
        title="PM career advice that actually helps"
        subtitle="Practical, no-fluff guides on breaking into and growing in Product Management."
      />
      <Section className="pt-6">
        <BlogList posts={posts} />

        <div className="mx-auto mt-16 max-w-2xl rounded-[2rem] bg-white/70 p-8 text-center shadow-soft ring-1 ring-lavender-100">
          <h2 className="text-xl font-bold text-charcoal">
            Never miss a post 💌
          </h2>
          <p className="mt-2 text-sm text-charcoal-soft">
            Get new articles and open PM roles in your inbox weekly.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </Section>
    </>
  );
}
