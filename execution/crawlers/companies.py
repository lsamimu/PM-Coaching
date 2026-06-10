"""Company-specific career sites via their public ATS APIs.

Most companies run their careers pages on one of a few Applicant Tracking
Systems (Greenhouse, Lever, Ashby), each of which exposes a public JSON board.
Pulling these is effectively "crawling the company's own jobs site".

Tokens below were verified to return data. Unknown/closed boards simply return
nothing and are skipped (self-annealing: prune dead tokens, add new ones).
"""
import sys

from . import util

# Verified Greenhouse board tokens (company slug).
GREENHOUSE = [
    "stripe", "databricks", "figma", "robinhood", "brex", "airtable",
    "gitlab", "discord", "reddit", "instacart", "dropbox", "cloudflare",
    "asana", "samsara", "lyft", "affirm", "twilio", "gusto",
    "mongodb", "sofi", "faire", "flexport",
    "airbnb", "doordashusa", "pinterest",
]

# Verified Lever board tokens.
LEVER = [
    "spotify", "mistral", "attentive", "ro", "kraken", "plaid", "netflix",
]

# Verified Ashby board tokens.
ASHBY = [
    "ramp", "openai", "linear", "vanta", "notion", "deel", "mercury",
    "watershed",
]


def _from_greenhouse(token):
    jobs = []
    r = util.get(
        f"https://boards-api.greenhouse.io/v1/boards/{token}/jobs",
        params={"content": "true"},
    )
    company = token.replace("usa", "").title()
    for j in r.json().get("jobs", []):
        title = j.get("title", "")
        content = j.get("content", "")
        if not util.is_pm_role(title, content):
            continue
        loc = (j.get("location") or {}).get("name", "")
        jobs.append(
            util.make_job(
                role=title,
                company=company,
                level=util.experience_level(title, content),
                link=j.get("absolute_url", ""),
                summary=util.summarize(content),
                deadline="Not specified",
                source=f"Company/Greenhouse ({company})",
                location=loc,
            )
        )
    return jobs


def _from_lever(token):
    jobs = []
    r = util.get(f"https://api.lever.co/v0/postings/{token}", params={"mode": "json"})
    company = token.title()
    for j in r.json():
        title = j.get("text", "")
        desc = j.get("descriptionPlain") or j.get("description", "")
        if not util.is_pm_role(title, desc):
            continue
        cats = j.get("categories") or {}
        commitment = cats.get("commitment", "")
        jobs.append(
            util.make_job(
                role=title,
                company=company,
                level=util.experience_level(title, desc, commitment if "intern" in commitment.lower() else ""),
                link=j.get("hostedUrl", ""),
                summary=util.summarize(desc),
                deadline="Not specified",
                source=f"Company/Lever ({company})",
                location=cats.get("location", ""),
            )
        )
    return jobs


def _from_ashby(token):
    jobs = []
    r = util.get(f"https://api.ashbyhq.com/posting-api/job-board/{token}")
    company = token.title()
    for j in r.json().get("jobs", []):
        title = j.get("title", "")
        desc = j.get("descriptionPlain") or j.get("descriptionHtml", "")
        if not util.is_pm_role(title, desc):
            continue
        emp = j.get("employmentType", "")
        jobs.append(
            util.make_job(
                role=title,
                company=company,
                level=util.experience_level(title, desc, emp if "intern" in emp.lower() else ""),
                link=j.get("jobUrl") or j.get("applyUrl", ""),
                summary=util.summarize(desc),
                deadline="Not specified",
                source=f"Company/Ashby ({company})",
                location=j.get("location", ""),
            )
        )
    return jobs


def crawl():
    jobs = []
    for token in GREENHOUSE:
        try:
            jobs += _from_greenhouse(token)
        except Exception as e:  # noqa: BLE001
            print(f"    Greenhouse[{token}] skipped: {e}", file=sys.stderr)
    for token in LEVER:
        try:
            jobs += _from_lever(token)
        except Exception as e:  # noqa: BLE001
            print(f"    Lever[{token}] skipped: {e}", file=sys.stderr)
    for token in ASHBY:
        try:
            jobs += _from_ashby(token)
        except Exception as e:  # noqa: BLE001
            print(f"    Ashby[{token}] skipped: {e}", file=sys.stderr)
    print(f"  Company sites (Greenhouse/Lever/Ashby): {len(jobs)} PM roles")
    return jobs
