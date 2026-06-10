"""Best-effort LinkedIn crawler using the public *guest* job endpoints.

NOTE / CAVEAT:
  LinkedIn does not offer a public jobs API and its Terms of Service restrict
  automated access. This module uses the unauthenticated "guest" endpoints that
  back the public job-search widget. They work for light, polite use but may be
  rate-limited or blocked (HTTP 429) at any time. The crawler degrades
  gracefully: if LinkedIn blocks it, it simply returns fewer/no rows rather than
  crashing the pipeline. Use responsibly and at your own discretion.

Endpoints:
  search: /jobs-guest/jobs/api/seeMoreJobPostings/search
  detail: /jobs-guest/jobs/api/jobPosting/<jobId>
"""
import re
import sys
import time

import common

SEARCH_URL = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
DETAIL_URL = "https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"

# Keep request volume polite.
KEYWORDS = ["product manager", "product manager intern", "associate product manager"]
PAGES = [0, 10, 20]          # start offsets per keyword
MAX_DETAIL_FETCHES = 40      # cap on detail-page requests


def _parse_cards(html_text):
    cards = []
    for block in re.split(r"<li[ >]", html_text)[1:]:
        link_m = re.search(r'href="(https://www\.linkedin\.com/jobs/view/[^"?]+)', block)
        title_m = re.search(r'base-search-card__title">\s*(.*?)\s*</h3>', block, re.S)
        comp_m = re.search(r'base-search-card__subtitle">\s*(?:<a[^>]*>)?\s*(.*?)\s*(?:</a>)?\s*</h4>', block, re.S)
        loc_m = re.search(r'job-search-card__location">\s*(.*?)\s*</span>', block, re.S)
        if not (link_m and title_m):
            continue
        link = link_m.group(1)
        jid_m = re.search(r'-(\d+)$', link)
        date_m = re.search(r'datetime="([^"]+)"', block)
        cards.append(
            {
                "link": link,
                "job_id": jid_m.group(1) if jid_m else "",
                "title": common.strip_html(title_m.group(1)),
                "company": common.strip_html(comp_m.group(1)) if comp_m else "",
                "location": common.strip_html(loc_m.group(1)) if loc_m else "",
                "posted": common.iso_to_date(date_m.group(1)) if date_m else "",
            }
        )
    return cards


def _fetch_detail(job_id):
    """Return (summary, seniority, employment_type, is_closed)."""
    r = common.polite_get(DETAIL_URL.format(job_id=job_id))
    if not r or r.status_code != 200:
        return "", "", "", False
    text = r.text
    is_closed = "no longer accepting applications" in text.lower()
    desc_m = re.search(r'show-more-less-html__markup[^>]*>(.*?)</div>', text, re.S)
    summary = common.summarize(desc_m.group(1)) if desc_m else ""
    crit = re.findall(r'description__job-criteria-text[^>]*>\s*(.*?)\s*</span>', text, re.S)
    crit = [common.strip_html(c) for c in crit]
    seniority = crit[0] if len(crit) >= 1 else ""
    employment = crit[1] if len(crit) >= 2 else ""
    return summary, seniority, employment, is_closed


def crawl():
    jobs = []
    seen_ids = set()
    detail_budget = MAX_DETAIL_FETCHES
    try:
        for kw in KEYWORDS:
            for start in PAGES:
                r = common.polite_get(
                    SEARCH_URL,
                    params={"keywords": kw, "location": "United States", "start": start},
                )
                if not r or r.status_code != 200:
                    continue
                for card in _parse_cards(r.text):
                    if not common.is_pm_role(card["title"]):
                        continue
                    if card["job_id"] and card["job_id"] in seen_ids:
                        continue
                    seen_ids.add(card["job_id"])

                    summary, seniority, employment, closed = "", "", "", False
                    if card["job_id"] and detail_budget > 0:
                        summary, seniority, employment, closed = _fetch_detail(card["job_id"])
                        detail_budget -= 1
                        time.sleep(0.3)
                    if closed:  # posting explicitly no longer accepting applicants
                        continue

                    level = common.experience_level(card["title"], summary, seniority)
                    if common.is_internship(card["title"], employment, seniority):
                        level = "Internship"
                    jobs.append(
                        common.make_job(
                            role=card["title"],
                            company=card["company"],
                            level=level,
                            link=card["link"],
                            summary=summary or "(Open the LinkedIn link for the full description.)",
                            deadline="Not specified",
                            source="LinkedIn",
                            location=card["location"],
                            posted=card.get("posted", ""),
                        )
                    )
                time.sleep(0.3)
        print(f"  LinkedIn: {len(jobs)} PM roles")
    except Exception as e:  # noqa: BLE001
        print(f"  LinkedIn FAILED (likely blocked/rate-limited): {e}", file=sys.stderr)
    return jobs
