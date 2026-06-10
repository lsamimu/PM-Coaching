"""Crawl Built In (builtin.com) Product Management jobs.

Built In serves server-rendered HTML job cards. We parse listing pages for the
job title, company, and link, then fetch a capped number of detail pages to
pull a description summary. Degrades gracefully if the markup changes.
"""
import html
import re
import sys
import time

import common

BASE = "https://builtin.com"

# (path, search term) listing queries to walk.
QUERIES = [
    ("/jobs/product", "product manager"),
    ("/jobs/product", "associate product manager"),
    ("/jobs/internships", "product manager"),
]
PAGES = [1, 2]
MAX_DETAIL_FETCHES = 30

TITLE_RE = re.compile(
    r'<a href="(/job/[^"]+)"[^>]*data-id="job-card-title"[^>]*'
    r'data-builtin-track-job-id="(\d+)"[^>]*>(.*?)</a>',
    re.S,
)
COMPANY_RE = re.compile(
    r'<a href="/company/[^"]+"[^>]*data-id="company-title"[^>]*'
    r'data-builtin-track-job-id="(\d+)"[^>]*>\s*<span>(.*?)</span>',
    re.S,
)
# Multi-location cards store every location in a tooltip; single-location cards
# render the location as plain text in the span after the location-dot icon.
TOOLTIP_RE = re.compile(r'aria-label="Job locations"[^>]*data-bs-title="(.*?)"', re.S)
PLAIN_LOC_RE = re.compile(r'text-gray-04[^>]*>(.*?)</span>', re.S)
POSTED_RE = re.compile(r'fa-clock[^>]*></i>\s*(.*?)\s*</span>', re.S)


def _card_posted(text, start, end):
    """Extract the relative post time (e.g. '3 Days Ago') for a card."""
    m = POSTED_RE.search(text, start, end)
    return common.strip_html(m.group(1)) if m else ""


def _card_location(text, start, end):
    """Extract the location string for the card spanning text[start:end]."""
    region = text[start:end]
    i = region.find("fa-location-dot")
    if i == -1:
        return ""
    sub = region[i : i + 700]

    m = TOOLTIP_RE.search(sub)
    if m:
        # Tooltip lists each location in its own <div>; keep them separated.
        decoded = html.unescape(m.group(1))
        decoded = re.sub(r"(?i)</div>|<br\s*/?>", "; ", decoded)
        raw = common.strip_html(decoded)
    else:
        m2 = PLAIN_LOC_RE.search(sub)
        raw = common.strip_html(m2.group(1)) if m2 else ""
    if not raw:
        return ""

    parts = [p.strip() for p in re.split(r"[\n;]| {2,}", raw) if p.strip()]
    seen, out = set(), []
    for p in parts:
        if p.lower() not in seen:
            seen.add(p.lower())
            out.append(p)
    return "; ".join(out[:4])


def _detail_summary(url):
    r = common.polite_get(url)
    if not r or r.status_code != 200:
        return ""
    m = re.search(r'<meta name="description" content="(.*?)"', r.text, re.S)
    if m:
        return common.summarize(m.group(1))
    return ""


def crawl():
    jobs = []
    seen = set()
    detail_budget = MAX_DETAIL_FETCHES
    try:
        for path, term in QUERIES:
            for page in PAGES:
                r = common.polite_get(
                    f"{BASE}{path}", params={"search": term, "page": page}
                )
                if not r or r.status_code != 200:
                    continue
                text = r.text
                company_map = {jid: common.strip_html(name) for jid, name in COMPANY_RE.findall(text)}

                matches = list(TITLE_RE.finditer(text))
                for idx, m in enumerate(matches):
                    href, jid, raw_title = m.group(1), m.group(2), m.group(3)
                    title = common.strip_html(raw_title)
                    if jid in seen or not common.is_pm_role(title):
                        continue
                    seen.add(jid)
                    link = BASE + href

                    # Location + post time live between this title and the next.
                    region_end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
                    location = _card_location(text, m.end(), region_end)
                    posted = _card_posted(text, m.end(), region_end)

                    summary = ""
                    if detail_budget > 0:
                        summary = _detail_summary(link)
                        detail_budget -= 1
                        time.sleep(0.2)

                    # Classify on the title only - Built In's "internships"
                    # listing also surfaces unrelated senior roles.
                    is_intern = common.is_internship(title)
                    level = "Internship" if is_intern else common.experience_level(title, summary)
                    jobs.append(
                        common.make_job(
                            role=title,
                            company=company_map.get(jid, ""),
                            level=level,
                            link=link,
                            summary=summary or "(Open the Built In link for the full description.)",
                            deadline="Not specified",
                            source="Built In",
                            location=location,
                            posted=posted,
                        )
                    )
                time.sleep(0.2)
        print(f"  Built In: {len(jobs)} PM roles")
    except Exception as e:  # noqa: BLE001
        print(f"  Built In FAILED: {e}", file=sys.stderr)
    return jobs
