"""Export crawler job data into the PM Launch Lab website.

Reads the crawler's intermediate `.tmp/jobs.json` (produced by
`execution/crawl_jobs.py`) and writes a website-friendly, categorized JSON to
`website/src/data/jobs.json`, which the Job Tracker page reads.

Categories (per the website directive):
  - PM Internships
  - Associate PM Roles
  - Product Analyst Roles
  - Full-Time PM Roles

Usage:
    .venv/bin/python execution/export_jobs_web.py

This is a lightweight bridge: run the crawler first (or run the full pipeline),
then run this to refresh the website data.
"""
import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / ".tmp" / "jobs.json"
DEST = ROOT / "website" / "src" / "data" / "jobs.json"

_ANALYST_RE = re.compile(r"\bproduct\s+analyst\b|\bdata\s+product\s+analyst\b", re.I)
_ASSOCIATE_RE = re.compile(r"\bassociate\b|\bapm\b|\bnew\s*grad\b|\bgraduate\b", re.I)
_INTERN_RE = re.compile(r"\b(intern(?:ship)?s?|co-?op)\b", re.I)


def categorize(job: dict) -> str:
    role = job.get("role", "") or ""
    level = job.get("experience_level", "") or ""
    blob = f"{role} {level}"
    if _INTERN_RE.search(blob) or level.strip().lower() == "internship":
        return "PM Internships"
    if _ANALYST_RE.search(role):
        return "Product Analyst Roles"
    if _ASSOCIATE_RE.search(blob) or "associate" in level.lower():
        return "Associate PM Roles"
    return "Full-Time PM Roles"


def main() -> None:
    if not SRC.exists():
        raise SystemExit(
            f"No crawler data at {SRC}.\n"
            "Run the crawler first, e.g.:\n"
            "  .venv/bin/python execution/run_pipeline.py --no-email"
        )

    data = json.loads(SRC.read_text())
    raw = [*data.get("internships", []), *data.get("fulltime", [])]

    # De-dupe on (role, company, link) and trim heavy fields.
    seen = set()
    jobs = []
    for j in raw:
        key = (j.get("role", ""), j.get("company", ""), j.get("link", ""))
        if key in seen:
            continue
        seen.add(key)
        summary = (j.get("summary", "") or "").strip()
        if len(summary) > 320:
            summary = summary[:320].rsplit(" ", 1)[0] + "..."
        jobs.append(
            {
                "role": j.get("role", "").strip(),
                "company": j.get("company", "").strip(),
                "level": j.get("experience_level", "").strip() or "Not specified",
                "link": j.get("link", "").strip(),
                "location": j.get("location", "").strip() or "Not specified",
                "posted": j.get("posted", "").strip(),
                "source": j.get("source", "").strip(),
                "summary": summary,
                "category": categorize(j),
            }
        )

    # Sort newest first (postings without a date go last).
    jobs.sort(key=lambda j: j["posted"] or "0000-00-00", reverse=True)

    out = {
        "generated_at": data.get(
            "generated_at", datetime.now(timezone.utc).isoformat()
        ),
        "count": len(jobs),
        "categories": {
            cat: sum(1 for j in jobs if j["category"] == cat)
            for cat in (
                "PM Internships",
                "Associate PM Roles",
                "Product Analyst Roles",
                "Full-Time PM Roles",
            )
        },
        "jobs": jobs,
    }

    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"Wrote {len(jobs)} jobs to {DEST}")
    for cat, n in out["categories"].items():
        print(f"  {cat}: {n}")


if __name__ == "__main__":
    main()
