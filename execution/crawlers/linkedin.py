"""LinkedIn jobs via the public guest endpoint (no login).

NOTE: LinkedIn has no official open jobs API and scraping is against their
Terms of Service. This uses the public, unauthenticated "jobs-guest" endpoint
that powers logged-out job search. It is gray-area and rate-limited: LinkedIn
returns HTTP 429 if hit too often, in which case this source yields nothing and
the run continues with the other sources.

It returns role, company, apply link and location only (no description or
deadline are exposed by the guest endpoint).
"""
import sys
import time

from bs4 import BeautifulSoup

from . import util

GUEST_URL = (
    "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
)
SEARCHES = ["product manager", "associate product manager", "product management intern"]
LOCATION = "United States"
PAGES = 2  # 25 cards per page


def _parse(html_text):
    soup = BeautifulSoup(html_text, "html.parser")
    out = []
    for card in soup.select("li"):
        title_el = card.select_one(".base-search-card__title")
        company_el = card.select_one(".base-search-card__subtitle")
        link_el = card.select_one("a.base-card__full-link") or card.select_one("a[href]")
        loc_el = card.select_one(".job-search-card__location")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        link = (link_el.get("href") if link_el else "").split("?")[0]
        out.append(
            util.make_job(
                role=title,
                company=company_el.get_text(strip=True) if company_el else "",
                level=util.experience_level(title),
                link=link,
                summary="(See full description on LinkedIn — guest listing.)",
                deadline="Not specified",
                source="LinkedIn",
                location=loc_el.get_text(strip=True) if loc_el else "",
            )
        )
    return out


def crawl():
    jobs = []
    blocked = False
    for term in SEARCHES:
        for page in range(PAGES):
            try:
                r = util.get(
                    GUEST_URL,
                    params={
                        "keywords": term,
                        "location": LOCATION,
                        "start": page * 25,
                    },
                )
                jobs += _parse(r.text)
                time.sleep(1.0)  # be polite; reduce rate-limit risk
            except Exception as e:  # noqa: BLE001
                blocked = True
                print(f"    LinkedIn[{term} p{page}] skipped: {e}", file=sys.stderr)
    pm = [j for j in jobs if util.is_pm_role(j["role"])]
    note = " (rate-limited on some queries)" if blocked else ""
    print(f"  LinkedIn: {len(pm)} PM roles{note}")
    return pm
