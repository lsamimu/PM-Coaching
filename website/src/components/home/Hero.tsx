"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CalendarHeart,
  CheckCircle2,
  Mail,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

const floaties = [
  { emoji: "🚀", className: "left-[6%] top-[18%]", anim: "animate-float-slow" },
  { emoji: "📓", className: "left-[2%] bottom-[16%]", anim: "animate-float-medium" },
  { emoji: "✅", className: "right-[8%] top-[12%]", anim: "animate-float-medium" },
  { emoji: "📝", className: "right-[4%] bottom-[22%]", anim: "animate-float-slow" },
  { emoji: "💡", className: "left-[44%] top-[6%]", anim: "animate-float-slow" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* floating decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {floaties.map((f) => (
          <span
            key={f.emoji + f.className}
            className={`absolute hidden text-3xl drop-shadow-sm sm:block md:text-4xl ${f.className} ${f.anim}`}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-lavender-700 ring-1 ring-lavender-200 backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-pink-400" />
            Coaching · Resources · AI-era PM guidance
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-4xl font-extrabold leading-[1.08] text-charcoal sm:text-5xl lg:text-6xl"
          >
            Helping future{" "}
            <span className="accent-underline text-gradient">Product Managers</span>{" "}
            launch their careers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-lg text-charcoal-soft lg:mx-0"
          >
            Coaching, templates, interview prep, and AI-era PM guidance — from a
            PM coach who&apos;s been exactly where you are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <Button href={site.calendly} external size="lg">
              <Rocket className="h-5 w-5" />
              Book a Discovery Call
            </Button>
            <Button href="/coaching" variant="ghost" size="lg">
              Explore Coaching
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-sm text-charcoal-soft"
          >
            💜 1:1 coaching for students, new grads &amp; career switchers
          </motion.p>
        </div>

        <LaunchPadVisual />
      </Container>
    </section>
  );
}

const launchChecklist = [
  "Resume & portfolio review",
  "Mock interviews",
  "Live PM role tracker",
] as const;

const launchStickers = [
  {
    icon: CalendarHeart,
    label: "1:1 Coaching",
    className: "left-0 top-2 -rotate-6 bg-pink-100 text-pink-600",
  },
  {
    icon: Briefcase,
    label: "PM Roles",
    className: "right-0 top-10 rotate-6 bg-mint-100 text-emerald",
  },
  {
    icon: Mail,
    label: "Launch Letter",
    className: "bottom-2 left-6 rotate-3 bg-lavender-100 text-lavender-700",
  },
] as const;

function LaunchPadVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md"
      aria-hidden
    >
      <div className="absolute -inset-4 -z-10 rounded-[2.75rem] bg-gradient-to-br from-lavender-200 via-pink-200 to-mint-200 blur-2xl" />

      {launchStickers.map((sticker, index) => (
        <motion.div
          key={sticker.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 + index * 0.08 }}
          className={`absolute z-20 flex items-center gap-2 rounded-2xl px-3 py-2 shadow-soft ring-1 ring-white/70 ${sticker.className}`}
        >
          <sticker.icon className="h-4 w-4 shrink-0" />
          <span className="text-xs font-bold sm:text-sm">{sticker.label}</span>
        </motion.div>
      ))}

      <div className="relative overflow-hidden rounded-[2.25rem] bg-white p-5 shadow-glow ring-1 ring-white/60 sm:p-6">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-lavender-100/80 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-pink-100/70 blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender-500">
                PM Launch Lab
              </p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-charcoal sm:text-[1.65rem]">
                Your career
                <span className="text-gradient"> launch pad</span>
              </h2>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-400 to-pink-400 text-white shadow-soft">
              <Rocket className="h-6 w-6" />
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {launchChecklist.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.35 + index * 0.08 }}
                className="flex items-center gap-3 rounded-2xl bg-cream/80 px-3 py-2.5 ring-1 ring-lavender-100"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-mint-400" />
                <span className="text-sm font-semibold text-charcoal">{item}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-lavender-50 px-3 py-3 ring-1 ring-lavender-100">
              <Target className="h-4 w-4 text-lavender-500" />
              <p className="mt-2 text-lg font-extrabold text-lavender-600">Break in</p>
              <p className="text-xs font-medium text-charcoal-soft">Students & switchers</p>
            </div>
            <div className="rounded-2xl bg-mint-50 px-3 py-3 ring-1 ring-mint-100">
              <Sparkles className="h-4 w-4 text-emerald" />
              <p className="mt-2 text-lg font-extrabold text-emerald">Level up</p>
              <p className="text-xs font-medium text-charcoal-soft">AI-era PM skills</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
