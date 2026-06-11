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
      <div className="border-y border-lavender-100 bg-white/50 py-6">
        <Container>
          <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {credibility.map((item) => (
              <li key={item}>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-charcoal-soft shadow-soft ring-1 ring-lavender-100 sm:px-5 sm:text-base">
                  <span className="text-lavender-400" aria-hidden>
                    ✦
                  </span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Container>
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
