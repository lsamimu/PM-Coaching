"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import type { PremiumProduct } from "@/lib/products";

export function FlagshipProductHero({ product }: { product: PremiumProduct }) {
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
        alert(data.message || "Checkout is coming soon!");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-lavender-500 via-lavender-600 to-pink-500 p-8 text-white shadow-glow sm:p-12 lg:p-14"
    >
      {/* decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1 text-xs font-bold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              PM Launch Lab Flagship
            </span>
            <span className="rounded-full bg-mint-300 px-3 py-1 text-xs font-bold text-charcoal">
              Career Playbook
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
            {product.title}
          </h2>
          <p className="mt-2 text-lg font-semibold text-white/90">
            {product.tagline}
          </p>
          <p className="mt-4 max-w-xl text-white/85">{product.description}</p>

          <div className="mt-6 rounded-2xl bg-white/15 p-4 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-wide text-mint-200">
              Your outcome
            </p>
            <p className="mt-1 text-lg font-semibold italic">
              &ldquo;I know exactly what to do to become a PM.&rdquo;
            </p>
          </div>

          <p className="mt-2 text-sm font-medium text-white/80">
            {product.owns}
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              "Skill gap analysis",
              "Resume transformation",
              "PM fundamentals",
              "Technical concepts for PMs",
              "90-day learning plan",
              "Weekly accountability",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                <Check className="h-4 w-4 shrink-0 text-mint-200" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={buy}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-lavender-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              {product.landingCopy.cta}
            </button>
            <Link
              href={`/resources/${product.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/15 px-6 py-4 text-base font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:bg-white/25"
            >
              See full breakdown
              <ArrowRight className="h-5 w-5" />
            </Link>
            {product.notionBundleUrl && (
              <a
                href={product.notionBundleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mint-300/90 px-6 py-4 text-base font-semibold text-charcoal transition-all hover:bg-mint-200"
              >
                <ExternalLink className="h-5 w-5" />
                Open Notion bundle
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-[2rem] bg-white p-6 text-charcoal shadow-2xl">
            <div className="text-center text-6xl">{product.emoji}</div>
            <p className="mt-4 text-center text-2xl font-extrabold text-lavender-600">
              {product.price}
            </p>
            <p className="text-center text-xs text-charcoal-soft">
              one-time · full Notion playbook
            </p>
            <div className="mt-6 space-y-2 border-t border-lavender-100 pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-emerald" />
                <span>90-day structured plan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-emerald" />
                <span>4 focused databases (no overlap with OS)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-emerald" />
                <span>Sammy&apos;s Microsoft PM journey</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-emerald" />
                <span>Lifetime updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
