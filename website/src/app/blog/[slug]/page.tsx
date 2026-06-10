import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { posts } from "@/lib/data";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-600 hover:gap-2.5 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <div className="mt-6 grid h-44 place-items-center rounded-[2rem] bg-gradient-to-br from-lavender-100 via-pink-50 to-mint-100 text-6xl">
          {post.emoji}
        </div>

        <span className="mt-8 inline-block text-sm font-semibold uppercase tracking-wide text-pink-400">
          {post.category}
        </span>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-charcoal sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-charcoal-soft">
          {new Date(post.date).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          · {post.readingTime} read
        </p>

        <div className="prose mt-8 max-w-none space-y-5 text-lg leading-relaxed text-charcoal-soft">
          <p className="text-xl font-medium text-charcoal">{post.excerpt}</p>
          <p>
            This is placeholder body copy for the article. Replace it with your
            real content — connect a CMS like Sanity, or write posts as MDX. The
            layout, typography, and SEO metadata are already wired up.
          </p>
          <p>
            Each post supports its own title, description, and Open Graph tags
            for great sharing and search visibility. Add headings, lists, images,
            and callouts here.
          </p>
          <h2 className="text-2xl font-bold text-charcoal">A section heading</h2>
          <p>
            Keep paragraphs short and skimmable. Aspiring PMs love concrete,
            actionable takeaways — frameworks, checklists, and examples.
          </p>
        </div>

        <div className="mt-12 rounded-[2rem] bg-white/70 p-8 text-center shadow-soft ring-1 ring-lavender-100">
          <h2 className="text-xl font-bold text-charcoal">Enjoyed this? 💜</h2>
          <p className="mt-2 text-sm text-charcoal-soft">
            Get the next one delivered to your inbox.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </article>
  );
}
