"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";
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
            Microsoft PM who&apos;s been exactly where you are.
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

        <PhotoCard />
      </Container>
    </section>
  );
}

function PhotoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-sm"
    >
      <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-br from-lavender-200 via-pink-200 to-mint-200 blur-2xl" />
      <div className="overflow-hidden rounded-[2.25rem] bg-white p-3 shadow-glow ring-1 ring-white/60">
        <Image
          src="/sammy.png"
          alt={`${site.founder}, Product Manager & PM career coach`}
          width={520}
          height={650}
          priority
          className="aspect-[4/5] w-full rounded-[1.75rem] object-cover object-top"
        />
      </div>

      <div className="absolute -bottom-5 -left-5 rotate-[-6deg] rounded-2xl bg-white px-4 py-3 shadow-soft ring-1 ring-lavender-100">
        <p className="text-xs font-semibold text-charcoal-soft">Currently</p>
        <p className="text-sm font-bold text-charcoal">PM @ Microsoft 🪟</p>
      </div>
      <div className="absolute -right-4 top-6 rotate-[6deg] rounded-2xl bg-mint-300 px-4 py-3 shadow-soft">
        <p className="text-sm font-bold text-charcoal">Your PM coach 💜</p>
      </div>
    </motion.div>
  );
}
