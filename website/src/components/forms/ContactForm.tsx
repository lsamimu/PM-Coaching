"use client";

import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

const goals = [
  "Break into PM",
  "Land a PM internship",
  "New grad job search",
  "Resume / LinkedIn help",
  "Interview prep",
  "Buy a resource",
  "Something else",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      goal: form.get("goal"),
      message: form.get("message"),
    };
    try {
      const res = await fetch("/api/contact", {
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
        <p className="mt-4 text-lg font-bold text-charcoal">Message sent!</p>
        <p className="mt-1 text-charcoal-soft">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" required className={inputClass} placeholder="Your name" />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required className={inputClass} placeholder="you@email.com" />
        </Field>
      </div>
      <Field label="What's your goal?" htmlFor="goal">
        <select id="goal" name="goal" className={inputClass} defaultValue={goals[0]}>
          {goals.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </Field>
      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Tell me a bit about where you are and how I can help…"
        />
      </Field>

      {status === "error" && (
        <p className="text-sm font-medium text-pink-400">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lavender-400 px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-lavender-500 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
        Send message
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-2xl border-0 bg-white px-4 py-3 text-charcoal shadow-sm ring-1 ring-lavender-100 placeholder:text-charcoal-soft/60 focus:ring-2 focus:ring-lavender-300";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-charcoal">
        {label}
      </span>
      {children}
    </label>
  );
}
