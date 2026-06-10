# PM Job Automation

Crawls public job boards for open **Product Management** roles (internships +
full-time), records them in an Excel workbook with two separate tabs, and emails
the workbook to you.

## Architecture (3-layer, see `CURSOR.md`)
- `directives/` — the SOP (`find_pm_jobs.md`)
- `execution/` — deterministic Python scripts
- `.tmp/` — intermediate `jobs.json` (regenerated each run)
- `output/` — the deliverable Excel workbooks
- `.env` — secrets (email credentials, optional API keys)

## Setup
```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
# Edit .env: set EMAIL_FROM and a Gmail App Password (EMAIL_APP_PASSWORD).
# Create an App Password at https://myaccount.google.com/apppasswords
```

## Run
```bash
# Full pipeline: crawl -> build Excel -> export to website -> email
.venv/bin/python execution/run_pipeline.py

# Crawl + update website data only (no email)
.venv/bin/python execution/run_pipeline.py --no-email
# or: ./scripts/refresh-jobs.sh
```

## Output
Two separate workbooks in `output/`, emailed together as two attachments:
- `pm_internships_<date>.xlsx` — internships only
- `pm_fulltime_<date>.xlsx` — full-time roles only

Each row: Role, Company, Experience Level, Apply Link, Job Summary,
Application Deadline, Date Posted, Location, Source.

## Freshness & active listings
Every run pulls live data, so the list is current. Only active postings are
kept: APM List is filtered to "Open" status, LinkedIn closed postings are
detected, and **every apply link is verified** — dead links (HTTP 404/410) are
dropped and the rest are resolved to their final working URL. Set
`VERIFY_LINKS=false` to skip checking, or `MAX_AGE_DAYS=N` to also drop postings
older than N days (default off).

## Keeping it always current (cloud automation)
A GitHub Actions workflow (`.github/workflows/pm-jobs.yml`) runs the whole
pipeline **daily at 8:00 AM US Pacific** in the cloud, so the list refreshes and
emails itself even when your laptop is off. It also uploads the workbook as a
downloadable artifact (backup in case email fails).

One-time setup:
1. Create a GitHub repository and push this project to it:
   ```bash
   git init && git add . && git commit -m "PM job automation"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
   (`.env`, `output/`, and `.tmp/` are git-ignored, so no secrets are committed.)
2. In the repo: **Settings -> Secrets and variables -> Actions -> New repository
   secret**, and add three secrets:
   - `EMAIL_TO` = `sammy.lydia26@gmail.com`
   - `EMAIL_FROM` = your sending Gmail address
   - `EMAIL_APP_PASSWORD` = your Gmail App Password
3. That's it. It runs daily automatically; you can also trigger it any time from
   the **Actions** tab ("Run workflow").

Notes:
- The schedule is in UTC (`0 15 * * *`). 15:00 UTC = 8 AM Pacific in summer
  (PDT) / 7 AM in winter (PST). Edit the cron in the workflow to change it.
- **LinkedIn may be blocked from GitHub's datacenter IPs** and return 0 there;
  the other sources still work, and the email flags any source that returns 0.
  For full LinkedIn coverage, run locally (`.venv/bin/python execution/run_pipeline.py`).

## Sources
Hand-picked:
- **Company career sites** — Greenhouse / Lever / Ashby public board APIs
  (edit the curated list in `execution/companies.py`).
- **LinkedIn** — public guest job endpoints (best-effort; subject to LinkedIn's
  Terms and rate limits).
- **Built In** — `builtin.com` job cards.
- **APM List** — `apmlist.com` APM / new-grad / internship program table.

Web-wide aggregators (broad coverage across the internet):
- **The Muse** — large multi-company aggregator (no key). Big breadth boost.
- **Remotive / Jobicy / Arbeitnow** — remote-focused boards (no key).
- **Adzuna** — broad aggregator incl. on-site roles (optional free key).
- **JSearch / Google for Jobs** — indexes Indeed, LinkedIn, Glassdoor,
  ZipRecruiter, etc. (optional RapidAPI key) — the closest thing to crawling the
  whole internet of job postings.
- **USAJOBS** — US federal jobs; always USA-bound, includes real deadlines
  (optional free key).

Not crawled:
- **RippleMatch** — no public listings (roles are behind a student-account
  login), so it can't be accessed without credentials.

A full crawl yields ~450+ unique **US** PM roles across ~190 companies in a
couple of minutes (more when the optional aggregator keys are set). Every source
flows through the US filter, active-link verification, and active-only checks.

Note: truly crawling "the entire internet" isn't feasible (or legal) directly;
the aggregator APIs above are how you get effectively web-wide coverage, since
they already index across thousands of sites.

## Location scope
By default the list is scoped to United States listings (`US_ONLY=true`).
Clearly non-US roles (London, Toronto, Bangalore, EMEA, etc.) are dropped;
US and unknown-location roles are kept. Set `US_ONLY=false` in `.env` for
worldwide results.
