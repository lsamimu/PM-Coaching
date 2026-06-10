"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { postCategories, type Post } from "@/lib/data";

export function BlogList({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {["All", ...postCategories].map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === c
                ? "bg-lavender-400 text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.7)]"
                : "bg-white/70 text-charcoal-soft ring-1 ring-lavender-100 hover:bg-lavender-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.article
            key={p.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            className="group flex flex-col overflow-hidden rounded-3xl bg-white/80 shadow-soft ring-1 ring-lavender-100 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-glow"
          >
            <Link href={`/blog/${p.slug}`} className="flex h-full flex-col">
              <div className="grid h-32 place-items-center bg-gradient-to-br from-lavender-100 via-pink-50 to-mint-100 text-5xl">
                {p.emoji}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-pink-400">
                  {p.category}
                </span>
                <h3 className="mt-2 text-lg font-bold leading-snug text-charcoal group-hover:text-lavender-600">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-charcoal-soft">
                  {p.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-charcoal-soft">
                  <span>
                    {new Date(p.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {p.readingTime}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-lavender-600">
                    Read <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
