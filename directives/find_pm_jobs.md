# Directive: Find Open Product Management Roles & Email the Sheet

## Goal
Crawl public job boards for open Product Management (PM) roles — both
**internships** and **full-time** positions — record them in an Excel workbook
with two separate tabs, and email the workbook to the user.

## Inputs
- None required from the user at run time.
- Configuration lives in `.env` (see `.env.example`):
  - `EMAIL_TO` — recipient (default: `sammy.lydia26@gmail.com`)
  - `EMAIL_FROM` + `EMAIL_APP_PASSWORD` — Gmail sender + App Password
  - Optional: `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` for extra coverage

## Tools / Scripts (in `execution/`)
- `crawl_jobs.py` — orchestrates all sources, de-dupes, classifies internship
  vs full-time, writes `.tmp/jobs.json`.
- `common.py` — shared helpers (HTTP w/ retry, HTML cleaning, PM detection,
  internship detection, experience-level inference, normalized job shape).
- `companies.py` — curated list of company ATS board tokens to crawl.
- `src_company_boards.py` — Greenhouse / Lever / Ashby company career sites.
- `src_linkedin.py` — LinkedIn public *guest* endpoints (best-effort).
- `src_builtin.py` — Built In (builtin.com) HTML job cards.
- `src_apmlist.py` — APM List (apmlist.com) APM/intern program table.
- `build_excel.py` — reads `.tmp/jobs.json`, writes TWO workbooks:
  `output/pm_internships_<date>.xlsx` and `output/pm_fulltime_<date>.xlsx`.
- `send_email.py` — emails the latest workbook as an attachment.
- `run_pipeline.py` — runs crawl → build → email in order.

## Location scope
By default the list is scoped to **United States** listings (`US_ONLY=true` in
`.env`). The crawler drops postings whose location is clearly outside the US and
keeps US + unknown-location postings (unknown is kept because APM List programs
list no location but are US-focused). Set `US_ONLY=false` for worldwide results,
or `KEEP_UNKNOWN_LOCATION=false` to also drop unparseable locations. The
US/non-US decision lives in `common.is_us_location()`.

## Freshness & active-listing guarantee
- The list is regenerated from live sources on every run, so it is current as of
  the run time (`generated_at` is recorded in `.tmp/jobs.json`).
- Only **active** postings are kept:
  - Company boards / Built In only list open roles (closed roles drop off).
  - APM List is filtered to **"Open"** status only (Not Yet Open / Paused /
    Closed are excluded).
  - LinkedIn detail pages are checked for "No longer accepting applications".
  - `VERIFY_LINKS=true` (default) checks every apply link and **drops dead
    links (HTTP 404/410)**; blocked/transient responses are kept, not dropped.
- **Correct apply link**: each link is resolved to its final URL during
  verification, so the user gets the working destination.
- A **Date Posted** column surfaces freshness (ISO date where available; Built In
  shows a relative "X ago"). Optional `MAX_AGE_DAYS` (default 0/off) can drop
  postings older than N days.

## Output
Two separate Excel workbooks emailed to `EMAIL_TO` as two attachments:
`output/pm_internships_<date>.xlsx` and `output/pm_fulltime_<date>.xlsx`.
Each row contains:
1. Role
2. Company
3. Experience Level (level of experience required)
4. Apply Link (clickable, verified active, resolved to final URL)
5. Job Summary (description summary)
6. Application Deadline
7. Date Posted
8. Location
9. Source

## Staying current (scheduled automation)
The list is current as of each run, so "always current" = run on a schedule.
A cloud workflow does this automatically:
- `.github/workflows/pm-jobs.yml` runs the full pipeline **daily at 15:00 UTC
  (8 AM US Pacific in summer)** via GitHub Actions, and on manual dispatch.
- Email credentials come from GitHub repo **Secrets** (`EMAIL_TO`, `EMAIL_FROM`,
  `EMAIL_APP_PASSWORD`), not from `.env`, which is git-ignored.
- The workbook is also uploaded as a build artifact (30-day retention).
- See README "Keeping it always current" for the one-time setup steps.

### Health check
`crawl_jobs.health_check()` records per-source counts and flags any source that
returns 0. Critical sources (Company boards, Built In, APM List) raise a
**HEALTH WARNING** (and a GitHub `::warning::` annotation in CI); the warning is
also included in the email body. LinkedIn is treated as **optional** (it is
often IP-blocked on cloud runners), so its 0 is a soft note rather than an alarm.

## How to run
```bash
pip install -r requirements.txt          # first time only
cp .env.example .env                      # then fill in email credentials
python execution/run_pipeline.py          # crawl + build + email
python execution/run_pipeline.py --no-email   # build only, no email
```

## Job sources
| Source            | Access            | Notes                                            |
|-------------------|-------------------|--------------------------------------------------|
| Company sites     | Public ATS APIs   | Greenhouse/Lever/Ashby boards in `companies.py`. Reliable, full descriptions, both intern + full-time. |
| LinkedIn          | Public guest endpoints | Best-effort; ToS restricts automation, may be rate-limited/blocked. Detail page gives seniority + employment type. |
| Built In          | HTML scrape       | Server-rendered job cards; capped detail fetches for summaries. |
| APM List          | HTML scrape       | Curated APM / new-grad / intern program table.   |
| The Muse          | Public API (no key) | Large multi-company aggregator; main breadth driver (`THEMUSE_MAX_PAGES`). |
| Remotive/Jobicy/Arbeitnow | Public APIs (no key) | Remote-focused boards. |
| Adzuna            | API key (optional)  | Broad aggregator incl. on-site roles. |
| JSearch (Google Jobs) | RapidAPI key (optional) | Indexes Indeed/LinkedIn/Glassdoor/ZipRecruiter — widest reach. |
| USAJOBS           | API key (optional)  | US federal jobs; always USA-bound; provides real `ApplicationCloseDate`. |
| RippleMatch       | NOT crawled       | No public listings — roles are behind a student-account login. Cannot be crawled without credentials. |

Aggregators live in `src_aggregators.py`. Keyed sources skip silently if their
key is unset and are marked OPTIONAL in the health check. Truly crawling the
whole web is impractical; these aggregators (esp. JSearch / Google for Jobs)
provide effectively web-wide coverage. All sources still pass through the US
filter + link verification + active-only checks.

To add more companies, append their board token to the right list in
`companies.py` (find tokens via boards.greenhouse.io/<token>,
jobs.lever.co/<token>, or jobs.ashbyhq.com/<token>). Dead/empty boards are
skipped automatically.

## Edge cases & learnings
- **Application deadline** is essentially never exposed by these sources;
  defaults to "Not specified" (APM List records application status instead).
- **Experience level** uses the source's explicit value when it's a real
  seniority (e.g. LinkedIn "Entry level"); commitment strings like "Full-time"
  / "Permanent" are ignored and the level is inferred from the title.
- **Internship detection uses WORD BOUNDARIES** (regex `\bintern...`) so titles
  like "International" or "Internal Tools" are NOT misread as internships.
  This bug was found and fixed during testing.
- Built In's `/jobs/internships` listing also returns non-intern roles, so
  internship classification is done on the **title**, not the listing path.
- Each source is wrapped in try/except so one failing source does not abort the
  run. Check stderr for `<source> FAILED` messages.
- LinkedIn/Built In cap their detail-page fetches to stay polite and fast.
- De-duplication is keyed on (role, company) and on apply link.
- Email requires a Gmail **App Password** (not the normal password) and
  2-Step Verification enabled on the Google account.
- Use a Python venv (`.venv/`): global pip is blocked by the sandbox. Run
  scripts with `.venv/bin/python execution/<script>.py`.
- A full crawl currently yields ~400 unique PM roles in ~60s.
