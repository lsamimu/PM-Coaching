"use client";

import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("done");
      setMessage(data.message || "You're in! Check your inbox 💜");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-mint-100 px-5 py-4 font-semibold text-emerald">
        <Check className="h-5 w-5" /> {message}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full flex-col gap-3 sm:flex-row ${
        compact ? "" : "mx-auto max-w-md"
      }`}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="flex-1 rounded-full border-0 bg-white px-5 py-3.5 text-charcoal shadow-soft ring-1 ring-lavender-100 placeholder:text-charcoal-soft/60 focus:ring-2 focus:ring-lavender-300"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender-400 px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-lavender-500 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
        Subscribe
      </button>
      {status === "error" && (
        <p className="text-sm font-medium text-pink-400 sm:absolute sm:mt-14">
          {message}
        </p>
      )}
    </form>
  );
}
