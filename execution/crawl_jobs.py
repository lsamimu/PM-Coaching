"""Crawl open Product Management roles from the configured job sources and
write the normalized, de-duplicated results to .tmp/jobs.json.

Sources:
  - Company career sites via public ATS APIs (Greenhouse / Lever / Ashby)
  - LinkedIn (public guest endpoints, best-effort)
  - Built In (builtin.com)
  - APM List (apmlist.com)

Note: RippleMatch is intentionally NOT crawled. It has no public job listings;
its roles are behind a student-account login, so it cannot be crawled without
credentials. Company boards + APM List + LinkedIn cover the same early-career
and internship audience.

Run:  python execution/crawl_jobs.py
"""
import json
import os
import sys
from datetime import date, datetime, timezone

import common  # noqa: F401  (ensures execution/ dir is importable first)
import config
import src_aggregators
import src_apmlist
import src_builtin
import src_company_boards
import src_linkedin


def dedupe(jobs):
    """Drop duplicate postings keyed on (role, company), then on (link)."""
    seen_pairs, seen_links, unique = set(), set(), []
    for j in jobs:
        pair = (j["role"].lower(), j["company"].lower())
        link = (j["link"] or "").lower()
        if pair in seen_pairs or (link and link in seen_links):
            continue
        seen_pairs.add(pair)
        if link:
            seen_links.add(link)
        unique.append(j)
    return unique


SOURCES = [
    ("Company career sites", src_company_boards.crawl),
    ("LinkedIn", src_linkedin.crawl),
    ("Built In", src_builtin.crawl),
    ("APM List", src_apmlist.crawl),
    # Web-wide aggregators (broad coverage across the internet)
    ("The Muse", src_aggregators.crawl_themuse),
    ("Remote boards", src_aggregators.crawl_remote_boards),
    ("Adzuna", src_aggregators.crawl_adzuna),
    ("JSearch (Google Jobs)", src_aggregators.crawl_jsearch),
    ("USAJOBS", src_aggregators.crawl_usajobs),
]

# Sources that may legitimately return 0 - either they're IP-blocked on cloud
# runners (LinkedIn) or they require an optional API key that may be unset.
# A 0 here is a soft note, not a critical alarm.
OPTIONAL_SOURCES = {"LinkedIn", "Adzuna", "JSearch (Google Jobs)", "USAJOBS"}


def health_check(raw_counts):
    """Build a health report from per-source raw counts and emit warnings.

    Returns a dict: {source_counts, down (critical 0s), degraded (optional 0s)}.
    """
    down = sorted(n for n, c in raw_counts.items() if c == 0 and n not in OPTIONAL_SOURCES)
    degraded = sorted(n for n, c in raw_counts.items() if c == 0 and n in OPTIONAL_SOURCES)
    in_ci = os.getenv("GITHUB_ACTIONS") == "true"

    if down:
        msg = "HEALTH WARNING: critical source(s) returned 0 results: " + ", ".join(down)
        print(msg, file=sys.stderr)
        if in_ci:
            print(f"::warning::{msg}")
    if degraded:
        note = "Note: optional source(s) returned 0 (often IP-blocked on cloud): " + ", ".join(degraded)
        print(note, file=sys.stderr)

    return {"source_counts": raw_counts, "down": down, "degraded": degraded}


def main():
    config.ensure_dirs()
    print("Crawling Product Management roles...")

    all_jobs = []
    raw_counts = {}
    for name, fn in SOURCES:
        try:
            jobs = fn()
        except Exception as e:  # noqa: BLE001
            print(f"  {name} FAILED: {e}", file=sys.stderr)
            jobs = []
        raw_counts[name] = len(jobs)
        all_jobs += jobs

    health = health_check(raw_counts)

    all_jobs = dedupe(all_jobs)

    if config.US_ONLY:
        before = len(all_jobs)
        kept = []
        for j in all_jobs:
            us = common.is_us_location(j.get("location", ""))
            if us is True or (us is None and config.KEEP_UNKNOWN_LOCATION):
                kept.append(j)
        all_jobs = kept
        print(f"  US filter: kept {len(all_jobs)} of {before} (dropped {before - len(all_jobs)} non-US)")

    if config.MAX_AGE_DAYS > 0:
        before = len(all_jobs)
        cutoff = datetime.now(timezone.utc).date()
        kept = []
        for j in all_jobs:
            try:
                posted = date.fromisoformat(j.get("posted", "")[:10])
                if (cutoff - posted).days > config.MAX_AGE_DAYS:
                    continue
            except ValueError:
                pass  # unknown/relative dates are kept
            kept.append(j)
        all_jobs = kept
        print(f"  Age filter (<= {config.MAX_AGE_DAYS}d): kept {len(all_jobs)} of {before}")

    if config.VERIFY_LINKS:
        before = len(all_jobs)
        all_jobs, dead = common.validate_jobs(all_jobs)
        print(f"  Link check: kept {len(all_jobs)} of {before} (dropped {dead} dead/expired links)")

    # Internship classification is STRICTLY based on the job TITLE containing the
    # whole word "intern"/"internship" (or "co-op"). Word boundaries mean
    # "International" / "Internal" do NOT count. The experience-level field is
    # never used to decide the bucket, so it can't cause false positives.
    internships, fulltime = [], []
    for j in all_jobs:
        if common.is_internship(j["role"]):
            j["experience_level"] = "Internship"
            internships.append(j)
        else:
            # Clear any stale "Internship" level a source may have set on a
            # role whose title is not actually an internship.
            if (j.get("experience_level") or "").strip().lower() == "internship":
                j["experience_level"] = common.experience_level(j["role"], j.get("summary", ""))
            fulltime.append(j)

    # Stable, useful ordering: by company then role.
    internships.sort(key=lambda x: (x["company"].lower(), x["role"].lower()))
    fulltime.sort(key=lambda x: (x["company"].lower(), x["role"].lower()))

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "counts": {
            "total": len(all_jobs),
            "internships": len(internships),
            "fulltime": len(fulltime),
        },
        "health": health,
        "internships": internships,
        "fulltime": fulltime,
    }

    config.JOBS_JSON.write_text(json.dumps(payload, indent=2))
    print(
        f"Done. {len(all_jobs)} unique roles "
        f"({len(internships)} internships, {len(fulltime)} full-time) "
        f"-> {config.JOBS_JSON}"
    )
    return payload


if __name__ == "__main__":
    main()
