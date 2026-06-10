"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, ExternalLink, Loader2 } from "lucide-react";
import type { Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -5 }}
      className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/80 shadow-soft ring-1 ring-lavender-100 backdrop-blur transition-shadow hover:shadow-glow"
    >
      <Link
        href={`/resources/${product.slug}`}
        className="group flex flex-1 flex-col"
      >
        <div className="relative grid h-40 place-items-center bg-gradient-to-br from-lavender-100 via-pink-50 to-mint-100 text-6xl">
          {product.emoji}
          {product.badge && (
            <span className="absolute right-3 top-3 rounded-full bg-lavender-400 px-3 py-1 text-xs font-bold text-white shadow">
              {product.badge}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 pb-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-pink-400">
            {product.category}
          </span>
          <h3 className="mt-1 text-xl font-bold text-charcoal group-hover:text-lavender-600">
            {product.title}
          </h3>
          {"tagline" in product && product.tagline && (
            <p className="mt-1 text-sm font-semibold text-lavender-600">
              {product.tagline}
            </p>
          )}
          <p className="mt-3 flex-1 text-sm text-charcoal-soft">
            {product.description}
          </p>
          {product.owns && (
            <p className="mt-2 text-xs font-semibold text-lavender-600">
              Owns: {product.owns}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-lavender-100 p-6 pt-5">
        <span className="text-2xl font-extrabold text-charcoal">
          {product.price}
        </span>
        <div className="flex items-center gap-2">
          {product.notionBundleUrl && (
            <a
              href={product.notionBundleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-lavender-600 ring-1 ring-lavender-200 transition hover:bg-lavender-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Bundle
            </a>
          )}
          <Link
            href={`/resources/${product.slug}`}
            className="hidden text-sm font-semibold text-lavender-600 sm:inline-flex sm:items-center sm:gap-1 hover:gap-2 transition-all"
          >
            View details <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={buy}
            disabled={loading}
            aria-label={`Buy ${product.title}`}
            className="inline-flex items-center gap-2 rounded-full bg-lavender-400 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-lavender-500 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
}
