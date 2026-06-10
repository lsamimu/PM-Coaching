"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, Check, Loader2, Calendar, X } from "lucide-react";
import { site } from "@/lib/site";

export function ResumeReviewForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setStatus("error");
      setMessage("Please attach your resume (PDF or Word).");
      return;
    }
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    form.set("resume", file);
    try {
      // 1. Send the resume so Sammy can prep.
      const res = await fetch("/api/resume-review", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // 2. Start payment (pay before booking).
      const book = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: "resume-review",
          email: String(form.get("email") || ""),
        }),
      });
      const bookData = await book.json();
      if (bookData.url) {
        window.location.href = bookData.url; // → Stripe → /coaching/booked → Calendly
        return;
      }

      // Stripe not configured yet: confirm resume received.
      setStatus("done");
      setMessage(bookData.message || data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-[2rem] bg-white/80 p-8 text-center shadow-soft ring-1 ring-lavender-100 sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald text-white">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-charcoal">
          Resume received! 🎉
        </h2>
        <p className="mx-auto mt-2 max-w-md text-charcoal-soft">{message}</p>
        <a
          href={site.calendly}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-lavender-400 px-7 py-3.5 font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-lavender-500"
        >
          <Calendar className="h-5 w-5" />
          Pick your time
        </a>
        <p className="mt-3 text-xs text-charcoal-soft">
          Once payments are connected, you&apos;ll check out securely before
          booking. For now this opens my Calendly directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="name" className="block">
          <span className="mb-1.5 block text-sm font-semibold text-charcoal">
            Name
          </span>
          <input id="name" name="name" required className={inputClass} placeholder="Your name" />
        </label>
        <label htmlFor="email" className="block">
          <span className="mb-1.5 block text-sm font-semibold text-charcoal">
            Email
          </span>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="you@email.com" />
        </label>
      </div>

      <label htmlFor="notes" className="block">
        <span className="mb-1.5 block text-sm font-semibold text-charcoal">
          What roles are you targeting? <span className="font-normal text-charcoal-soft">(optional)</span>
        </span>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="e.g. PM internships at big tech, new-grad APM programs…"
        />
      </label>

      {/* File dropzone */}
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-charcoal">
          Your resume <span className="font-normal text-charcoal-soft">(PDF or Word, max 8 MB)</span>
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center gap-3 rounded-2xl bg-mint-50 p-4 ring-1 ring-mint-200">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint-200 text-emerald">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-charcoal">{file.name}</p>
              <p className="text-xs text-charcoal-soft">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Remove file"
              className="grid h-9 w-9 place-items-center rounded-full text-charcoal-soft hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) setFile(f);
            }}
            className={`flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              dragOver
                ? "border-lavender-400 bg-lavender-50"
                : "border-lavender-200 bg-white hover:border-lavender-300 hover:bg-lavender-50"
            }`}
          >
            <UploadCloud className="h-8 w-8 text-lavender-400" />
            <span className="text-sm font-semibold text-charcoal">
              Click to upload or drag & drop
            </span>
            <span className="text-xs text-charcoal-soft">PDF, DOC, or DOCX</span>
          </button>
        )}
      </div>

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
          <UploadCloud className="h-5 w-5" />
        )}
        Send resume &amp; pay $100
      </button>
      <p className="text-center text-xs text-charcoal-soft">
        $100 · includes a complimentary LinkedIn optimization. Your resume goes
        straight to Sammy, then you pay and pick a time.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-2xl border-0 bg-white px-4 py-3 text-charcoal shadow-sm ring-1 ring-lavender-100 placeholder:text-charcoal-soft/60 focus:ring-2 focus:ring-lavender-300";
