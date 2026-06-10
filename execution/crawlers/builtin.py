"""Built In (builtin.com) job board.

The listing pages are server-rendered, so we parse the job cards directly, then
enrich each Product Management hit by fetching its detail page and reading the
embedded JSON-LD JobPosting (which includes the description, hiring company, and
a real application deadline via `validThrough`).
"""
import json
import re
import sys
import time

from bs4 import BeautifulSoup

from . import util

LISTING = "https://builtin.com/jobs/product"
SEARCHES = ["product manager", "associate product manager", "product manager intern"]
PAGES = 2
MAX_ENRICH = 40  # cap detail-page fetches to keep runtime reasonable


def _collect_links(term):
    found = {}
    for page in range(1, PAGES + 1):
        try:
            r = util.get(LISTING, params={"search": term, "page": page})
        except Exception as e:  # noqa: BLE001
            print(f"    BuiltIn[{term} p{page}] skipped: {e}", file=sys.stderr)
            break
        soup = BeautifulSoup(r.text, "html.parser")
        anchors = soup.select('a[href^="/job/"]')
        if not anchors:
            break
        for a in anchors:
            title = a.get_text(strip=True)
            href = a.get("href")
            if title and href and util.is_pm_role(title):
                found["https://builtin.com" + href] = title
    return found


def _enrich(url, title):
    company, summary, deadline, location = "", "", "Not specified", ""
    try:
        r = util.get(url)
        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(tag.string or "{}")
            except (json.JSONDecodeError, TypeError):
                continue
            items = data if isinstance(data, list) else [data]
            for item in items:
                if item.get("@type") == "JobPosting":
                    summary = util.summarize(item.get("description", ""))
                    org = item.get("hiringOrganization") or {}
                    company = org.get("name", "") if isinstance(org, dict) else ""
                    valid = item.get("validThrough")
                    if valid:
                        deadline = str(valid)[:10]
                    loc = item.get("jobLocation")
                    if isinstance(loc, list) and loc:
                        loc = loc[0]
                    if isinstance(loc, dict):
                        addr = loc.get("address", {}) or {}
                        location = ", ".join(
                            x for x in [addr.get("addressLocality"), addr.get("addressRegion")] if x
                        )
                    return company, summary, deadline, location
    except Exception as e:  # noqa: BLE001
        print(f"    BuiltIn enrich skipped ({url}): {e}", file=sys.stderr)
    return company, summary, deadline, location


def crawl():
    links = {}
    for term in SEARCHES:
        links.update(_collect_links(term))

    jobs = []
    for i, (url, title) in enumerate(links.items()):
        if i >= MAX_ENRICH:
            break
        company, summary, deadline, location = _enrich(url, title)
        jobs.append(
            util.make_job(
                role=title,
                company=company,
                level=util.experience_level(title, summary),
                link=url,
                summary=summary or "(See full description on Built In.)",
                deadline=deadline,
                source="Built In",
                location=location,
            )
        )
        time.sleep(0.3)
    print(f"  Built In: {len(jobs)} PM roles")
    return jobs
