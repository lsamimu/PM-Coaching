"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { JobCategory } from "@/lib/jobs";

const VALUE_PROPS = [
  "Every live role: internships, APM, product analyst & full-time PM",
  "Search, filter by category & source, sort, and save favorites",
  "Refreshed continuously — new roles added as they go live",
  "Pay with Venmo — access link emailed once payment is confirmed",
  "One-time payment, lifetime access. No subscription.",
];

export function PMRolesTeaser({
  count,
  categories,
  generatedAt,
  priceLabel,
  venmoHandle,
  venmoPayUrl,
  notice,
}: {
  count: number;
  categories: Record<JobCategory, number>;
  generatedAt: string;
  priceLabel: string;
  venmoHandle: string | null;
  venmoPayUrl: string | null;
  notice?: string;
}) {
  const [email, setEmail] = useState("");
  const [venmoUsername, setVenmoUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const updated = (() => {
    try {
      return new Date(generatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  })();

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/pm-roles/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, venmoUsername: venmoUsername || undefined }),
      });
      const data = await res.json();
      setMsg(data.message || data.error || "Something went wrong.");
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function resendLink(e: React.FormEvent) {
    e.preventDefault();
    setResending(true);
    setMsg(null);
    try {
      const res = await fetch("/api/pm-roles/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      setMsg(data.message || data.error || "Check your inbox.");
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  }

  const categoryEntries = (
    Object.entries(categories) as [JobCategory, number][]
  ).filter(([, n]) => n > 0);

  const payNote = email
    ? `Live PM Roles - ${email}`
    : "Live PM Roles - include your email";

  return (
    <div className="mx-auto max-w-3xl">
      {notice && (
        <div className="mb-6 rounded-2xl bg-mint-100 px-5 py-4 text-center text-sm font-semibold text-charcoal ring-1 ring-mint-200">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="col-span-2 rounded-3xl bg-gradient-to-br from-lavender-400 to-pink-400 p-6 text-white shadow-soft sm:col-span-1">
          <div className="text-4xl font-extrabold">{count}+</div>
          <div className="mt-1 text-sm font-semibold opacity-90">live roles</div>
        </div>
        {categoryEntries.map(([cat, n]) => (
          <div
            key={cat}
            className="rounded-3xl bg-white/80 p-6 shadow-soft ring-1 ring-lavender-100"
          >
            <div className="text-3xl font-extrabold text-charcoal">{n}</div>
            <div className="mt-1 text-xs font-semibold text-charcoal-soft">
              {cat}
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mt-6 overflow-hidden rounded-3xl bg-white/80 p-8 shadow-soft ring-1 ring-lavender-100"
      >
        <div className="flex items-center justify-center gap-2 text-lavender-600">
          <Lock className="h-5 w-5" />
          <span className="text-sm font-bold uppercase tracking-wide">
            Full list locked
          </span>
        </div>
        <h3 className="mt-4 text-center text-2xl font-bold text-charcoal">
          Unlock all {count}+ PM roles
        </h3>
        {updated && (
          <p className="mt-1 text-center text-sm text-charcoal-soft">
            Last updated {updated}
          </p>
        )}

        <ul className="mx-auto mt-6 max-w-md space-y-3">
          {VALUE_PROPS.map((v) => (
            <li key={v} className="flex items-start gap-3 text-sm text-charcoal">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-mint-500" />
              <span>{v}</span>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-md">
          <p className="text-center text-sm font-bold text-charcoal">
            Step 1 — Pay {priceLabel} via Venmo
          </p>
          {venmoHandle ? (
            <>
              <p className="mt-2 text-center text-sm text-charcoal-soft">
                Send to{" "}
                <span className="font-semibold text-charcoal">{venmoHandle}</span>
                . Include your email in the payment note.
              </p>
              {venmoPayUrl && (
                <div className="mt-4 flex justify-center">
                  <a
                    href={venmoPayUrl.replace(
                      /note=[^&]*/,
                      `note=${encodeURIComponent(payNote)}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#008CFF] px-8 py-3.5 text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-[#0070cc]"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open Venmo — {priceLabel}
                  </a>
                </div>
              )}
            </>
          ) : (
            <p className="mt-2 text-center text-sm text-charcoal-soft">
              Venmo payments coming soon — check back shortly.
            </p>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-md border-t border-lavender-100 pt-8">
          <p className="text-center text-sm font-bold text-charcoal">
            Step 2 — Get your access link
          </p>
          <p className="mt-2 text-center text-sm text-charcoal-soft">
            After paying, enter your email below. We&apos;ll confirm your payment
            and email your access link — no screenshots needed.
          </p>
          <form onSubmit={submitPayment} className="mt-4 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email you used in Venmo note"
              className="w-full rounded-full border border-lavender-200 bg-white px-5 py-3 text-sm text-charcoal outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            />
            <input
              type="text"
              value={venmoUsername}
              onChange={(e) => setVenmoUsername(e.target.value)}
              placeholder="Your Venmo username (optional)"
              className="w-full rounded-full border border-lavender-200 bg-white px-5 py-3 text-sm text-charcoal outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
            />
            <button
              type="submit"
              disabled={submitting || !venmoHandle}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lavender-400 px-8 py-3.5 text-base font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-lavender-500 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  I&apos;ve paid — send my access link
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {msg && (
          <p className="mt-4 text-center text-sm font-medium text-lavender-700">
            {msg}
          </p>
        )}
      </motion.div>

      <div className="mt-6 rounded-3xl bg-lavender-50/60 p-6 ring-1 ring-lavender-100">
        <p className="text-sm font-semibold text-charcoal">
          Already have access?
        </p>
        <p className="mt-1 text-sm text-charcoal-soft">
          Enter your email for a fresh access link.
        </p>
        <form
          onSubmit={resendLink}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 rounded-full border border-lavender-200 bg-white px-5 py-3 text-sm text-charcoal outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
          />
          <button
            type="submit"
            disabled={resending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-lavender-600 ring-1 ring-lavender-200 transition hover:bg-lavender-50 disabled:opacity-60"
          >
            {resending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send link <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
