"""Crawl company-specific career sites via their public ATS board APIs.

Covers three common applicant-tracking systems:
  - Greenhouse: https://boards-api.greenhouse.io/v1/boards/<token>/jobs?content=true
  - Lever:      https://api.lever.co/v0/postings/<token>?mode=json
  - Ashby:      https://api.ashbyhq.com/posting-api/job-board/<token>

Only Product Management roles are kept. Returns normalized job dicts.
"""
import sys

import common
import companies


def crawl_greenhouse():
    jobs = []
    for token in companies.GREENHOUSE:
        r = common.polite_get(
            f"https://boards-api.greenhouse.io/v1/boards/{token}/jobs",
            params={"content": "true"},
        )
        if not r or r.status_code != 200:
            continue
        try:
            postings = r.json().get("jobs", [])
        except ValueError:
            continue
        for p in postings:
            title = p.get("title", "")
            content = p.get("content", "")
            if not common.is_pm_role(title, content):
                continue
            loc = (p.get("location") or {}).get("name", "")
            jobs.append(
                common.make_job(
                    role=title,
                    company=token.replace("-", " ").title(),
                    level=common.experience_level(title, content),
                    link=p.get("absolute_url", ""),
                    summary=common.summarize(content),
                    deadline="Not specified",
                    source="Company (Greenhouse)",
                    location=loc,
                    posted=common.iso_to_date(p.get("updated_at", "")),
                )
            )
    print(f"  Company/Greenhouse: {len(jobs)} PM roles")
    return jobs


def crawl_lever():
    jobs = []
    for token in companies.LEVER:
        r = common.polite_get(
            f"https://api.lever.co/v0/postings/{token}", params={"mode": "json"}
        )
        if not r or r.status_code != 200:
            continue
        try:
            postings = r.json()
        except ValueError:
            continue
        for p in postings:
            title = p.get("text", "")
            desc = p.get("descriptionPlain") or p.get("description", "")
            if not common.is_pm_role(title, desc):
                continue
            cats = p.get("categories", {}) or {}
            jobs.append(
                common.make_job(
                    role=title,
                    company=token.replace("-", " ").title(),
                    level=common.experience_level(title, desc, cats.get("commitment", "")),
                    link=p.get("hostedUrl", ""),
                    summary=common.summarize(desc),
                    deadline="Not specified",
                    source="Company (Lever)",
                    location=cats.get("location", ""),
                    posted=common.epoch_ms_to_date(p.get("createdAt")),
                )
            )
    print(f"  Company/Lever: {len(jobs)} PM roles")
    return jobs


def crawl_ashby():
    jobs = []
    for token in companies.ASHBY:
        r = common.polite_get(
            f"https://api.ashbyhq.com/posting-api/job-board/{token}"
        )
        if not r or r.status_code != 200:
            continue
        try:
            postings = r.json().get("jobs", [])
        except ValueError:
            continue
        for p in postings:
            title = p.get("title", "")
            desc = p.get("descriptionPlain") or p.get("descriptionHtml", "")
            if not common.is_pm_role(title, desc):
                continue
            jobs.append(
                common.make_job(
                    role=title,
                    company=p.get("companyName") or token.replace("-", " ").title(),
                    level=common.experience_level(title, desc, p.get("employmentType", "")),
                    link=p.get("jobUrl") or p.get("applyUrl", ""),
                    summary=common.summarize(desc),
                    deadline="Not specified",
                    source="Company (Ashby)",
                    location=p.get("location", ""),
                    posted=common.iso_to_date(p.get("publishedAt", "")),
                )
            )
    print(f"  Company/Ashby: {len(jobs)} PM roles")
    return jobs


def crawl():
    jobs = []
    try:
        jobs += crawl_greenhouse()
    except Exception as e:  # noqa: BLE001
        print(f"  Greenhouse FAILED: {e}", file=sys.stderr)
    try:
        jobs += crawl_lever()
    except Exception as e:  # noqa: BLE001
        print(f"  Lever FAILED: {e}", file=sys.stderr)
    try:
        jobs += crawl_ashby()
    except Exception as e:  # noqa: BLE001
        print(f"  Ashby FAILED: {e}", file=sys.stderr)
    return jobs
