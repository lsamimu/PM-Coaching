"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { metrics, credibility } from "@/lib/site";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const isFloat = !Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {isFloat ? display.toFixed(1) : Math.round(display)}
      {suffix}
    </span>
  );
}

export function Credibility() {
  return (
    <section className="py-12">
      {/* marquee strip */}
      <div className="relative overflow-hidden border-y border-lavender-100 bg-white/50 py-4">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...credibility, ...credibility, ...credibility, ...credibility].map(
            (item, i) => (
              <span
                key={i}
                className="flex items-center gap-3 whitespace-nowrap text-lg font-bold text-charcoal-soft"
              >
                <span className="text-lavender-400">✦</span>
                {item}
              </span>
            ),
          )}
        </div>
      </div>

      {metrics.length > 0 && (
        <Container className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-3xl bg-white/70 p-6 text-center shadow-soft ring-1 ring-lavender-100 backdrop-blur transition-transform hover:-translate-y-1"
              >
                <div className="text-3xl font-extrabold text-lavender-600 sm:text-4xl">
                  <Counter value={m.value} suffix={m.suffix} />
                </div>
                <p className="mt-1 text-sm font-medium text-charcoal-soft">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      )}
    </section>
  );
}
