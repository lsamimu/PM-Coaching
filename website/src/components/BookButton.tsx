"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-lg px-8 py-4",
};

/**
 * Initiates the pay-then-book flow for a paid coaching service.
 * Redirects to Stripe Checkout when configured; otherwise shows a friendly note.
 */
export function BookButton({
  slug,
  children,
  size = "sm",
  className,
}: {
  slug: string;
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function go() {
    setLoading(true);
    setNote("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setNote(data.message || data.error || "Booking isn't available yet.");
    } catch {
      setNote("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        onClick={go}
        disabled={loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full bg-lavender-400 font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-lavender-500 disabled:opacity-60",
          sizes[size],
          className,
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
      {note && (
        <span className="max-w-[16rem] text-right text-xs text-charcoal-soft">
          {note}
        </span>
      )}
    </span>
  );
}
