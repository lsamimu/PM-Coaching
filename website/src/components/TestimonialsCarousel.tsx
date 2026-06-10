"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/BrandIcons";
import type { Testimonial } from "@/lib/data";

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const t = items[index];

  const paginate = (d: number) =>
    setState(([i]) => [(i + d + items.length) % items.length, d]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative min-h-[20rem] overflow-hidden rounded-[2rem] bg-white/80 p-8 shadow-glow ring-1 ring-lavender-100 backdrop-blur sm:p-12">
        <Quote className="absolute right-8 top-8 h-12 w-12 text-lavender-100" />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir >= 0 ? -40 : 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.outcome && (
              <span className="inline-block rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-emerald">
                {t.outcome}
              </span>
            )}
            <p className="mt-4 text-xl font-medium leading-relaxed text-charcoal sm:text-2xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-lavender-200 to-pink-200 text-lg font-bold text-white">
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
                  className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-lavender-50 text-lavender-500 transition-colors hover:bg-lavender-100"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          aria-label="Previous testimonial"
          onClick={() => paginate(-1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-charcoal shadow-soft ring-1 ring-lavender-100 transition-colors hover:bg-lavender-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setState([i, i > index ? 1 : -1])}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-7 bg-lavender-400" : "w-2.5 bg-lavender-200"
              }`}
            />
          ))}
        </div>
        <button
          aria-label="Next testimonial"
          onClick={() => paginate(1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-charcoal shadow-soft ring-1 ring-lavender-100 transition-colors hover:bg-lavender-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
