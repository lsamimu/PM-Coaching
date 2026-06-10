"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Building2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { JOB_CATEGORIES, type Job, type JobCategory } from "@/lib/jobs";

const SAVED_KEY = "pmll.savedJobs";

function jobId(j: Job) {
  return `${j.company}::${j.role}::${j.link}`;
}

type SortKey = "newest" | "company" | "role";

export function JobTracker({
  jobs,
  categoryCounts,
  generatedAt,
}: {
  jobs: Job[];
  categoryCounts: Record<JobCategory, number>;
  generatedAt: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "All">("All");
  const [source, setSource] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [onlySaved, setOnlySaved] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const toggleSave = (j: Job) => {
    setSaved((prev) => {
      const next = new Set(prev);
      const id = jobId(j);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const sources = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.source))).sort()],
    [jobs],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = jobs.filter((j) => {
      if (category !== "All" && j.category !== category) return false;
      if (source !== "All" && j.source !== source) return false;
      if (onlySaved && !saved.has(jobId(j))) return false;
      if (q) {
        const hay = `${j.role} ${j.company} ${j.location} ${j.level}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "company") return a.company.localeCompare(b.company);
      if (sort === "role") return a.role.localeCompare(b.role);
      return (b.posted || "").localeCompare(a.posted || "");
    });
    return list;
  }, [jobs, query, category, source, onlySaved, saved, sort]);

  return (
    <div>
      {/* Category chips */}
      <div className="flex flex-wrap justify-center gap-2">
        <Chip active={category === "All"} onClick={() => setCategory("All")}>
          All <span className="opacity-60">({jobs.length})</span>
        </Chip>
        {JOB_CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c} <span className="opacity-60">({categoryCounts[c] ?? 0})</span>
          </Chip>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-white/70 p-4 shadow-soft ring-1 ring-lavender-100 backdrop-blur sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-soft/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, company, or location…"
            aria-label="Search jobs"
            className="w-full rounded-full border-0 bg-white py-3 pl-12 pr-4 text-charcoal shadow-sm ring-1 ring-lavender-100 placeholder:text-charcoal-soft/60 focus:ring-2 focus:ring-lavender-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-charcoal-soft" />
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            aria-label="Filter by source"
            className="rounded-full border-0 bg-white px-4 py-3 text-sm font-medium text-charcoal shadow-sm ring-1 ring-lavender-100 focus:ring-2 focus:ring-lavender-300"
          >
            {sources.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All sources" : s}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort jobs"
            className="rounded-full border-0 bg-white px-4 py-3 text-sm font-medium text-charcoal shadow-sm ring-1 ring-lavender-100 focus:ring-2 focus:ring-lavender-300"
          >
            <option value="newest">Newest</option>
            <option value="company">Company A–Z</option>
            <option value="role">Role A–Z</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-charcoal-soft">
        <span>
          Showing <strong className="text-charcoal">{filtered.length}</strong>{" "}
          roles
        </span>
        <button
          onClick={() => setOnlySaved((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors ${
            onlySaved
              ? "bg-lavender-400 text-white"
              : "bg-white text-charcoal-soft ring-1 ring-lavender-100 hover:bg-lavender-50"
          }`}
        >
          <BookmarkCheck className="h-4 w-4" />
          Saved ({saved.size})
        </button>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white/70 p-12 text-center text-charcoal-soft ring-1 ring-lavender-100">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-medium">No roles match your filters yet.</p>
          <p className="text-sm">Try clearing search or switching category.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {filtered.map((j, i) => {
            const id = jobId(j);
            const isSaved = saved.has(id);
            return (
              <motion.li
                key={id + i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
                className="group flex flex-col gap-3 rounded-3xl bg-white/80 p-5 shadow-soft ring-1 ring-lavender-100 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-glow sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-lavender-100 px-2.5 py-0.5 text-xs font-semibold text-lavender-700">
                      {j.category}
                    </span>
                    {j.level && j.level !== "Not specified" && (
                      <span className="rounded-full bg-mint-100 px-2.5 py-0.5 text-xs font-semibold text-emerald">
                        {j.level}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 truncate text-lg font-bold text-charcoal">
                    {j.role}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal-soft">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-4 w-4" /> {j.company}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {j.location}
                    </span>
                    <span className="opacity-70">via {j.source}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleSave(j)}
                    aria-label={isSaved ? "Remove from saved" : "Save job"}
                    aria-pressed={isSaved}
                    className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${
                      isSaved
                        ? "bg-lavender-400 text-white"
                        : "bg-lavender-50 text-lavender-500 hover:bg-lavender-100"
                    }`}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                  <a
                    href={j.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-charcoal-soft"
                  >
                    Apply <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 text-center text-xs text-charcoal-soft">
        Live roles refreshed from the PM Launch Lab crawler · last updated{" "}
        {new Date(generatedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-lavender-400 text-white shadow-[0_8px_20px_-8px_rgba(124,58,237,0.7)]"
          : "bg-white/70 text-charcoal-soft ring-1 ring-lavender-100 hover:bg-lavender-50 hover:text-lavender-700"
      }`}
    >
      {children}
    </button>
  );
}
