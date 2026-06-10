"""Web-wide aggregator sources.

These APIs index Product Management roles from across the internet (many
thousands of company sites, plus Indeed / Glassdoor / ZipRecruiter / LinkedIn
via Google for Jobs), giving far broader coverage than the hand-picked sources.

No key required:
  - The Muse   (themuse.com) - large multi-company aggregator
  - Remotive / Jobicy / Arbeitnow - remote-focused boards

Optional (need a free API key in .env, skipped silently if absent):
  - Adzuna   - broad aggregator incl. on-site roles
  - JSearch  - Google for Jobs aggregator (RapidAPI)
  - USAJOBS  - US federal government jobs (always USA-bound; gives real deadlines)

Everything returned here still flows through the pipeline's US filter, active-
link verification, and active-only checks, so results stay current + USA-bound.
"""
import sys
import time

import common
import config


# --------------------------------------------------------------------------
# No-key aggregators
# --------------------------------------------------------------------------
def crawl_themuse():
    jobs = []
    try:
        for page in range(config.THEMUSE_MAX_PAGES):
            r = common.polite_get(
                "https://www.themuse.com/api/public/jobs",
                params={"category": "Product Management", "page": page},
            )
            if not r or r.status_code != 200:
                break  # 400 once we pass the last page
            results = r.json().get("results", [])
            if not results:
                break
            for x in results:
                title = x.get("name", "")
                if not common.is_pm_role(title):
                    continue
                locs = [l.get("name", "") for l in x.get("locations", []) if l.get("name")]
                location = "; ".join(locs[:3])
                if common.is_us_location(location) is False:
                    continue  # pre-drop clearly non-US to save link checks
                desc = x.get("contents", "")
                jobs.append(
                    common.make_job(
                        role=title,
                        company=(x.get("company") or {}).get("name", ""),
                        level=common.experience_level(title, desc),
                        link=(x.get("refs") or {}).get("landing_page", ""),
                        summary=common.summarize(desc),
                        deadline="Not specified",
                        source="The Muse",
                        location=location,
                        posted=common.iso_to_date(x.get("publication_date", "")),
                    )
                )
            time.sleep(0.2)
        print(f"  The Muse: {len(jobs)} PM roles")
    except Exception as e:  # noqa: BLE001
        print(f"  The Muse FAILED: {e}", file=sys.stderr)
    return jobs


def crawl_remote_boards():
    """Remotive + Jobicy + Arbeitnow (remote-focused, no key)."""
    jobs = []
    # Remotive
    try:
        for term in ("product manager", "product management"):
            r = common.polite_get(
                "https://remotive.com/api/remote-jobs",
                params={"search": term, "limit": 100},
            )
            if not r or r.status_code != 200:
                continue
            for j in r.json().get("jobs", []):
                title = j.get("title", "")
                if not common.is_pm_role(title, j.get("description", "")):
                    continue
                jobs.append(
                    common.make_job(
                        role=title,
                        company=j.get("company_name", ""),
                        level=common.experience_level(title, j.get("description", "")),
                        link=j.get("url", ""),
                        summary=common.summarize(j.get("description", "")),
                        deadline="Not specified",
                        source="Remotive",
                        location=j.get("candidate_required_location", "Remote"),
                        posted=common.iso_to_date(j.get("publication_date", "")),
                    )
                )
    except Exception as e:  # noqa: BLE001
        print(f"  Remotive FAILED: {e}", file=sys.stderr)

    # Jobicy
    try:
        r = common.polite_get(
            "https://jobicy.com/api/v2/remote-jobs",
            params={"count": 100, "tag": "product manager"},
        )
        if r and r.status_code == 200:
            for j in r.json().get("jobs", []):
                title = j.get("jobTitle", "")
                desc = j.get("jobDescription") or j.get("jobExcerpt", "")
                if not common.is_pm_role(title, desc):
                    continue
                jobs.append(
                    common.make_job(
                        role=title,
                        company=j.get("companyName", ""),
                        level=common.experience_level(title, desc, j.get("jobLevel", "")),
                        link=j.get("url", ""),
                        summary=common.summarize(desc),
                        deadline="Not specified",
                        source="Jobicy",
                        location=j.get("jobGeo", "Remote"),
                        posted=common.iso_to_date(j.get("pubDate", "")),
                    )
                )
    except Exception as e:  # noqa: BLE001
        print(f"  Jobicy FAILED: {e}", file=sys.stderr)

    # Arbeitnow
    try:
        for page in range(1, 4):
            r = common.polite_get(
                "https://www.arbeitnow.com/api/job-board-api", params={"page": page}
            )
            if not r or r.status_code != 200:
                break
            data = r.json().get("data", [])
            if not data:
                break
            for j in data:
                title = j.get("title", "")
                if not common.is_pm_role(title, j.get("description", "")):
                    continue
                jobs.append(
                    common.make_job(
                        role=title,
                        company=j.get("company_name", ""),
                        level=common.experience_level(title, j.get("description", "")),
                        link=j.get("url", ""),
                        summary=common.summarize(j.get("description", "")),
                        deadline="Not specified",
                        source="Arbeitnow",
                        location=j.get("location", "Remote" if j.get("remote") else ""),
                        posted=common.epoch_ms_to_date((j.get("created_at") or 0) * 1000),
                    )
                )
    except Exception as e:  # noqa: BLE001
        print(f"  Arbeitnow FAILED: {e}", file=sys.stderr)

    print(f"  Remote boards (Remotive/Jobicy/Arbeitnow): {len(jobs)} PM roles")
    return jobs


# --------------------------------------------------------------------------
# Optional keyed aggregators
# --------------------------------------------------------------------------
def crawl_adzuna():
    if not (config.ADZUNA_APP_ID and config.ADZUNA_APP_KEY):
        print("  Adzuna: skipped (set ADZUNA_APP_ID / ADZUNA_APP_KEY in .env)")
        return []
    jobs = []
    try:
        for page in range(1, 4):
            r = common.polite_get(
                f"https://api.adzuna.com/v1/api/jobs/{config.ADZUNA_COUNTRY}/search/{page}",
                params={
                    "app_id": config.ADZUNA_APP_ID,
                    "app_key": config.ADZUNA_APP_KEY,
                    "what": "product manager",
                    "results_per_page": 50,
                    "content-type": "application/json",
                },
            )
            if not r or r.status_code != 200:
                break
            for j in r.json().get("results", []):
                title = j.get("title", "")
                if not common.is_pm_role(title, j.get("description", "")):
                    continue
                jobs.append(
                    common.make_job(
                        role=title,
                        company=(j.get("company") or {}).get("display_name", ""),
                        level=common.experience_level(title, j.get("description", "")),
                        link=j.get("redirect_url", ""),
                        summary=common.summarize(j.get("description", "")),
                        deadline="Not specified",
                        source="Adzuna",
                        location=(j.get("location") or {}).get("display_name", ""),
                        posted=common.iso_to_date(j.get("created", "")),
                    )
                )
        print(f"  Adzuna: {len(jobs)} PM roles")
    except Exception as e:  # noqa: BLE001
        print(f"  Adzuna FAILED: {e}", file=sys.stderr)
    return jobs


def crawl_jsearch():
    """JSearch on RapidAPI = Google for Jobs (Indeed, LinkedIn, Glassdoor...)."""
    if not config.RAPIDAPI_KEY:
        print("  JSearch (Google Jobs): skipped (set RAPIDAPI_KEY in .env)")
        return []
    jobs = []
    headers = {
        "X-RapidAPI-Key": config.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    try:
        for query in ("product manager jobs in usa", "product management intern usa"):
            r = common.polite_get(
                "https://jsearch.p.rapidapi.com/search",
                params={"query": query, "num_pages": 3, "country": "us", "date_posted": "month"},
                extra_headers=headers,
            )
            if not r or r.status_code != 200:
                continue
            for j in r.json().get("data", []):
                title = j.get("job_title", "")
                if not common.is_pm_role(title, j.get("job_description", "")):
                    continue
                city = j.get("job_city") or ""
                state = j.get("job_state") or ""
                country = j.get("job_country") or ""
                location = ", ".join(p for p in (city, state, country) if p)
                jobs.append(
                    common.make_job(
                        role=title,
                        company=j.get("employer_name", ""),
                        level=common.experience_level(title, j.get("job_description", ""), j.get("job_employment_type", "")),
                        link=j.get("job_apply_link") or j.get("job_google_link", ""),
                        summary=common.summarize(j.get("job_description", "")),
                        deadline="Not specified",
                        source="JSearch (Google Jobs)",
                        location=location,
                        posted=common.iso_to_date(j.get("job_posted_at_datetime_utc", "")),
                    )
                )
        print(f"  JSearch (Google Jobs): {len(jobs)} PM roles")
    except Exception as e:  # noqa: BLE001
        print(f"  JSearch FAILED: {e}", file=sys.stderr)
    return jobs


def crawl_usajobs():
    """US federal jobs - always USA-bound and includes real close dates."""
    if not (config.USAJOBS_API_KEY and config.USAJOBS_EMAIL):
        print("  USAJOBS: skipped (set USAJOBS_API_KEY / USAJOBS_EMAIL in .env)")
        return []
    jobs = []
    headers = {
        "Authorization-Key": config.USAJOBS_API_KEY,
        "User-Agent": config.USAJOBS_EMAIL,
        "Host": "data.usajobs.gov",
    }
    try:
        r = common.polite_get(
            "https://data.usajobs.gov/api/search",
            params={"Keyword": "product manager", "ResultsPerPage": 100},
            extra_headers=headers,
        )
        if r and r.status_code == 200:
            items = (r.json().get("SearchResult", {}) or {}).get("SearchResultItems", [])
            for item in items:
                d = item.get("MatchedObjectDescriptor", {}) or {}
                title = d.get("PositionTitle", "")
                if not common.is_pm_role(title, d.get("QualificationSummary", "")):
                    continue
                locs = [l.get("LocationName", "") for l in d.get("PositionLocation", []) if l.get("LocationName")]
                deadline = d.get("ApplicationCloseDate", "")
                jobs.append(
                    common.make_job(
                        role=title,
                        company=d.get("OrganizationName", "U.S. Government"),
                        level=common.experience_level(title, d.get("QualificationSummary", "")),
                        link=d.get("PositionURI", ""),
                        summary=common.summarize(d.get("QualificationSummary", "")),
                        deadline=common.iso_to_date(deadline) if deadline else "Not specified",
                        source="USAJOBS",
                        location="; ".join(locs[:3]) or "United States",
                        posted=common.iso_to_date(d.get("PublicationStartDate", "")),
                    )
                )
        print(f"  USAJOBS: {len(jobs)} PM roles")
    except Exception as e:  # noqa: BLE001
        print(f"  USAJOBS FAILED: {e}", file=sys.stderr)
    return jobs
