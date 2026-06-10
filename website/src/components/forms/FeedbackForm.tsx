"use client";

import { useState } from "react";
import { Star, Send, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  "Resume Review",
  "Career Clarity Session",
  "Interview Prep",
  "General / other",
];

export function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      setStatus("error");
      setMessage("Please pick a star rating.");
      return;
    }
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = {
      rating,
      name: form.get("name"),
      email: form.get("email"),
      service: form.get("service"),
      message: form.get("message"),
      consent: form.get("consent") === "on",
    };
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("done");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl bg-mint-100 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald text-white">
          <Check className="h-7 w-7" />
        </div>
        <p className="mt-4 text-lg font-bold text-charcoal">Thank you! 💜</p>
        <p className="mt-1 text-charcoal-soft">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="mb-2 block text-sm font-semibold text-charcoal">
          Your rating
        </span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-9 w-9",
                  (hover || rating) >= n
                    ? "fill-pink-300 text-pink-300"
                    : "fill-transparent text-lavender-200",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="name" className="block">
          <span className="mb-1.5 block text-sm font-semibold text-charcoal">
            Name
          </span>
          <input id="name" name="name" required className={inputClass} placeholder="Your name" />
        </label>
        <label htmlFor="email" className="block">
          <span className="mb-1.5 block text-sm font-semibold text-charcoal">
            Email <span className="font-normal text-charcoal-soft">(optional)</span>
          </span>
          <input id="email" name="email" type="email" className={inputClass} placeholder="you@email.com" />
        </label>
      </div>

      <label htmlFor="service" className="block">
        <span className="mb-1.5 block text-sm font-semibold text-charcoal">
          Which service?
        </span>
        <select id="service" name="service" className={inputClass} defaultValue={services[0]}>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label htmlFor="message" className="block">
        <span className="mb-1.5 block text-sm font-semibold text-charcoal">
          Your feedback
        </span>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="What was your experience like? What changed for you?"
        />
      </label>

      <label className="flex items-start gap-2.5 text-sm text-charcoal-soft">
        <input
          type="checkbox"
          name="consent"
          className="mt-0.5 h-4 w-4 rounded border-lavender-200 text-lavender-500"
        />
        <span>
          You can feature my feedback as a testimonial (with my first name) once
          you review it.
        </span>
      </label>

      {status === "error" && (
        <p className="text-sm font-medium text-pink-400">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lavender-400 px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-lavender-500 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
        Submit feedback
      </button>
      <p className="text-center text-xs text-charcoal-soft">
        Your feedback goes privately to Sammy — it won&apos;t appear on the site
        unless she features it.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-2xl border-0 bg-white px-4 py-3 text-charcoal shadow-sm ring-1 ring-lavender-100 placeholder:text-charcoal-soft/60 focus:ring-2 focus:ring-lavender-300";
