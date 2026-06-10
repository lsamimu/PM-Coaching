"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Database,
  Download,
  Layers,
  Loader2,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { PremiumProduct } from "@/lib/products";
import {
  getNotionDatabaseUrl,
  getNotionPageUrl,
  getNotionSectionUrl,
  getNotionTemplateUrl,
} from "@/lib/notion-links";
import { NotionAccessBar, NotionLink } from "@/components/NotionLink";
import { Reveal } from "@/components/motion/Reveal";

export function ProductLanding({ product }: { product: PremiumProduct }) {
  const [loading, setLoading] = useState(false);

  async function buy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Checkout is coming soon — join the newsletter to get notified!");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-lavender-600 hover:gap-2.5 transition-all"
          >
            ← All resources
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              {product.badge && (
                <span className="inline-block rounded-full bg-lavender-400 px-4 py-1 text-xs font-bold text-white">
                  {product.badge}
                </span>
              )}
              <span className="ml-2 text-sm font-semibold text-pink-400">
                {product.category}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
                {product.landingCopy.headline}
              </h1>
              <p className="mt-4 text-lg text-charcoal-soft">
                {product.landingCopy.subheadline}
              </p>
              <ul className="mt-6 space-y-2">
                {product.landingCopy.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-charcoal">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={buy}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-lavender-400 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-lavender-500 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  {product.landingCopy.cta}
                </button>
                <span className="text-sm text-charcoal-soft">
                  Instant Notion access · Lifetime updates
                </span>
              </div>
              {product.notionBundleUrl && (
                <NotionAccessBar
                  bundleUrl={product.notionBundleUrl}
                  productTitle={product.title}
                />
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-lavender-200 via-pink-100 to-mint-100 blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-glow ring-1 ring-lavender-100">
                <div className="text-center text-7xl">{product.emoji}</div>
                <h2 className="mt-4 text-center text-2xl font-bold text-charcoal">
                  {product.title}
                </h2>
                <p className="mt-1 text-center text-sm font-semibold text-pink-400">
                  {product.tagline}
                </p>
                <p className="mt-6 text-center text-4xl font-extrabold text-lavender-600">
                  {product.price}
                </p>
                <p className="text-center text-xs text-charcoal-soft">
                  one-time · Notion workspace
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem → Outcome */}
      <section className="border-y border-lavender-100 bg-white/50 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl bg-pink-50 p-7 ring-1 ring-pink-100">
              <p className="text-sm font-bold uppercase tracking-wide text-pink-400">
                The problem
              </p>
              <p className="mt-3 text-charcoal">{product.problem}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="rounded-3xl bg-mint-50 p-7 ring-1 ring-mint-100">
              <p className="text-sm font-bold uppercase tracking-wide text-emerald">
                The outcome
              </p>
              <p className="mt-3 text-charcoal">{product.outcome}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Scope — what this owns vs. not */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl bg-lavender-50 p-6 ring-1 ring-lavender-100">
                <p className="text-sm font-bold uppercase tracking-wide text-lavender-600">
                  This product owns
                </p>
                <p className="mt-2 font-semibold text-charcoal">{product.owns}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="rounded-3xl bg-white/80 p-6 ring-1 ring-lavender-100">
                <p className="text-sm font-bold uppercase tracking-wide text-charcoal-soft">
                  Not included — by design
                </p>
                <ul className="mt-3 space-y-2">
                  {product.notIncluded.map((item) => (
                    <li key={item} className="text-sm text-charcoal-soft">
                      → {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features + Included */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-charcoal">
            Everything included
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl bg-white/80 p-7 shadow-soft ring-1 ring-lavender-100">
                <div className="flex items-center gap-2 text-lg font-bold text-charcoal">
                  <Sparkles className="h-5 w-5 text-lavender-500" />
                  Features
                </div>
                <ul className="mt-4 space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="rounded-3xl bg-white/80 p-7 shadow-soft ring-1 ring-lavender-100">
                <div className="flex items-center gap-2 text-lg font-bold text-charcoal">
                  <Layers className="h-5 w-5 text-lavender-500" />
                  Included assets
                </div>
                <ul className="mt-4 space-y-2">
                  {product.includedAssets.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-charcoal-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-lavender-400" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Notion structure */}
      <section className="bg-white/40 py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-charcoal">
            Notion workspace structure
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-charcoal-soft">
            A complete, organized workspace — duplicate the bundle and start in 15 minutes.
            {product.notionBundleUrl && " Click any page to open it in Notion."}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.notionStructure.map((block, i) => {
              const sectionUrl = getNotionSectionUrl(product.slug, block.section);
              return (
                <Reveal key={block.section} delay={i}>
                  <div className="rounded-2xl bg-white/80 p-5 shadow-soft ring-1 ring-lavender-100">
                    {sectionUrl ? (
                      <NotionLink href={sectionUrl} className="font-bold text-charcoal no-underline hover:text-lavender-700">
                        {block.section}
                      </NotionLink>
                    ) : (
                      <p className="font-bold text-charcoal">{block.section}</p>
                    )}
                    <ul className="mt-3 space-y-1">
                      {block.pages.map((page) => {
                        const pageUrl = getNotionPageUrl(product.slug, page);
                        return (
                          <li key={page} className="text-sm text-charcoal-soft">
                            ·{" "}
                            {pageUrl ? (
                              <NotionLink href={pageUrl}>{page}</NotionLink>
                            ) : (
                              page
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Database schema */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-center justify-center gap-2">
            <Database className="h-6 w-6 text-lavender-500" />
            <h2 className="text-3xl font-bold text-charcoal">Database schema</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {product.databases.map((db, i) => {
              const dbUrl = getNotionDatabaseUrl(product.slug, db.name);
              return (
              <Reveal key={db.name} delay={i}>
                <div className="rounded-2xl bg-gradient-to-br from-lavender-50 to-white p-6 ring-1 ring-lavender-100">
                  {dbUrl ? (
                    <NotionLink href={dbUrl} className="font-bold text-lavender-700">
                      {db.name}
                    </NotionLink>
                  ) : (
                    <p className="font-bold text-lavender-700">{db.name}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {db.fields.map((field) => (
                      <span
                        key={field}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-charcoal ring-1 ring-lavender-100"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
            })}
          </div>
        </div>
      </section>

      {/* Templates + Workflow */}
      <section className="border-y border-lavender-100 bg-white/50 py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <h3 className="text-xl font-bold text-charcoal">Templates &amp; checklists</h3>
              <ul className="mt-4 space-y-2">
                {product.templates.map((t) => {
                  const templateUrl = getNotionTemplateUrl(product.slug, t);
                  return (
                    <li
                      key={t}
                      className="rounded-xl bg-white/80 px-4 py-2.5 text-sm text-charcoal-soft ring-1 ring-lavender-100"
                    >
                      {templateUrl ? (
                        <NotionLink href={templateUrl}>{t}</NotionLink>
                      ) : (
                        t
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
            <Reveal delay={1}>
              <div className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-lavender-500" />
                <h3 className="text-xl font-bold text-charcoal">User workflow</h3>
              </div>
              <ol className="mt-4 space-y-3">
                {product.userWorkflow.map((w) => (
                  <li
                    key={w.step}
                    className="flex gap-3 rounded-xl bg-white/80 p-4 ring-1 ring-lavender-100"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lavender-400 text-sm font-bold text-white">
                      {w.step}
                    </span>
                    <span className="text-sm text-charcoal-soft">{w.action}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sample data */}
      {product.sampleData && product.sampleData.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-charcoal-soft">
              Pre-loaded sample data
            </p>
            <div className="mt-4 space-y-2">
              {product.sampleData.map((s) => (
                <p
                  key={s}
                  className="rounded-xl bg-lavender-50 px-4 py-2 text-sm text-charcoal"
                >
                  {s}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upsells */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h3 className="text-center text-xl font-bold text-charcoal">
            Pairs well with
          </h3>
          <ul className="mt-4 space-y-2">
            {product.upsells.map((u) => (
              <li
                key={u}
                className="flex items-center gap-2 rounded-2xl bg-mint-50 px-5 py-3 text-sm text-charcoal ring-1 ring-mint-100"
              >
                <ArrowRight className="h-4 w-4 text-emerald" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20">
        <Reveal className="mx-auto max-w-3xl rounded-[2.5rem] bg-gradient-to-br from-lavender-400 to-pink-400 px-8 py-12 text-center text-white shadow-glow sm:px-12">
          <p className="text-5xl">{product.emoji}</p>
          <h2 className="mt-4 text-3xl font-extrabold">{product.title}</h2>
          <p className="mx-auto mt-2 max-w-lg text-white/90">{product.tagline}</p>
          <button
            onClick={buy}
            disabled={loading}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-lavender-600 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Download className="h-5 w-5" />
            )}
            {product.landingCopy.cta}
          </button>
        </Reveal>
      </section>
    </div>
  );
}
