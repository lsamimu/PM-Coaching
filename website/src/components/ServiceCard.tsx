"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookButton } from "@/components/BookButton";
import type { Service } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ServiceCard({
  service,
  detailed = false,
}: {
  service: Service;
  detailed?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "relative flex h-full flex-col rounded-3xl bg-white/80 p-7 shadow-soft ring-1 backdrop-blur transition-shadow hover:shadow-glow",
        service.popular ? "ring-2 ring-lavender-300" : "ring-lavender-100",
      )}
    >
      {service.popular && (
        <span className="absolute -top-3 left-7 rounded-full bg-lavender-400 px-3 py-1 text-xs font-bold text-white shadow">
          Most popular ✨
        </span>
      )}

      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-lavender-100 to-pink-100 text-2xl">
        {service.emoji}
      </div>

      <h3 className="mt-5 text-xl font-bold text-charcoal">{service.title}</h3>
      <p className="mt-1 text-sm font-semibold text-pink-400 font-[family-name:var(--font-accent)]">
        {service.tagline}
      </p>
      <p className="mt-3 text-sm text-charcoal-soft">{service.description}</p>

      {service.bonus && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-mint-100 to-pink-100 px-4 py-2.5 ring-1 ring-mint-200">
          <span className="text-lg">🎁</span>
          <span className="text-sm font-bold text-charcoal">
            Bonus: {service.bonus}
          </span>
        </div>
      )}

      {detailed && (
        <ul className="mt-5 space-y-2">
          {service.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm text-charcoal">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
              {o}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 pt-2">
        <span className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-charcoal">
            {service.price}
          </span>
          {service.priceUnit && (
            <span className="text-xs font-semibold text-charcoal-soft">
              {service.priceUnit}
            </span>
          )}
        </span>
        {detailed ? (
          service.ctaHref ? (
            <Button href={service.ctaHref} size="sm">
              {service.cta}
            </Button>
          ) : (
            <BookButton slug={service.slug} size="sm">
              {service.cta}
            </BookButton>
          )
        ) : (
          <Link
            href="/coaching"
            className="inline-flex items-center gap-1 text-sm font-semibold text-lavender-600 hover:gap-2 transition-all"
          >
            Learn more <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
