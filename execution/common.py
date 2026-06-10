"""Shared helpers for all job-source crawlers.

Provides HTTP fetching with retries, HTML cleaning, PM-role detection,
internship detection, experience-level inference, and the normalized job shape.
"""
import html
import re
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

import requests

import config

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}
TIMEOUT = 25


def polite_get(url, params=None, retries=2, pause=0.4, extra_headers=None):
    """GET with light retry/backoff. Returns a Response or None on failure."""
    headers = dict(HEADERS)
    if extra_headers:
        headers.update(extra_headers)
    for attempt in range(retries + 1):
        try:
            r = requests.get(url, params=params, headers=headers, timeout=TIMEOUT)
            if r.status_code == 429:
                time.sleep(1.5 * (attempt + 1))
                continue
            return r
        except requests.RequestException:
            time.sleep(pause * (attempt + 1))
    return None


# --------------------------------------------------------------------------
# Text helpers
# --------------------------------------------------------------------------
def strip_html(text):
    if not text:
        return ""
    text = html.unescape(text)
    text = re.sub(r"(?is)<(script|style).*?</\1>", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def summarize(text, limit=600):
    clean = strip_html(text)
    if len(clean) <= limit:
        return clean
    return clean[:limit].rsplit(" ", 1)[0] + "..."


# --------------------------------------------------------------------------
# Classification
# --------------------------------------------------------------------------
def is_pm_role(title, description=""):
    """True if the title looks like a Product Management role.

    Excludes adjacent-but-different roles like Product Designer, Product
    Marketing, Product Engineer, and Production roles.
    """
    t = (title or "").lower()
    excludes = [
        "product designer",
        "product design",
        "product marketing",
        "product engineer",
        "production",
        "product support",
        "product specialist",
        "product analyst",
        "data product",  # often analytics, keep out unless explicitly PM
    ]
    if any(x in t for x in excludes) and not any(
        k in t for k in ["product manager", "product management", "product owner"]
    ):
        return False
    if any(kw in t for kw in config.PM_KEYWORDS):
        return True
    return False


# Word-boundary match so "international"/"internal" do NOT count as internships.
INTERN_RE = re.compile(r"\b(intern(?:ship)?s?|co-?op)\b", re.I)


def is_internship(title, job_type="", level=""):
    blob = " ".join([title or "", job_type or "", level or ""])
    return bool(INTERN_RE.search(blob))


# Explicit level labels coming from sources (e.g. LinkedIn seniority).
_LEVEL_MAP = {
    "internship": "Internship",
    "entry level": "Entry / Associate",
    "associate": "Entry / Associate",
    "mid-senior level": "Mid-Senior",
    "mid senior": "Mid-Senior",
    "director": "Director",
    "executive": "Executive",
    "not applicable": "",
    # Commitment / employment-type strings are NOT seniority - ignore them so
    # they don't leak into the experience-level column.
    "full-time": "",
    "fulltime": "",
    "part-time": "",
    "parttime": "",
    "permanent": "",
    "contract": "",
    "temporary": "",
    "full time": "",
}


def experience_level(title, description="", explicit_level=""):
    if explicit_level:
        key = explicit_level.strip().lower()
        if key in _LEVEL_MAP:
            mapped = _LEVEL_MAP[key]
            if mapped:
                return mapped
        elif key:
            return explicit_level.strip().title()

    if INTERN_RE.search(title or ""):
        return "Internship"

    blob = (title or "").lower()
    checks = [
        (["chief product", "cpo"], "Executive (CPO)"),
        (["vp ", "vice president", "head of product"], "VP / Head of Product"),
        (["director"], "Director"),
        (["principal"], "Principal"),
        (["staff"], "Staff"),
        (["group product manager", "gpm"], "Group PM (Senior)"),
        (["senior", "sr.", "sr ", "lead"], "Senior"),
        (["associate", "junior", "jr.", "jr ", "entry", "graduate", "new grad", "early career"], "Entry / Associate"),
        (["mid", "intermediate"], "Mid-level"),
    ]
    for needles, label in checks:
        if any(n in blob for n in needles):
            return label

    desc = (description or "").lower()
    m = re.search(r"(\d+)\+?\s*(?:-\s*\d+\s*)?years?", desc)
    if m:
        years = int(m.group(1))
        if years <= 1:
            return "Entry-level (0-1 yrs)"
        if years <= 3:
            return "Mid-level (2-3 yrs)"
        if years <= 6:
            return "Senior (4-6 yrs)"
        return f"Senior+ ({years}+ yrs)"
    return "Not specified"


# --------------------------------------------------------------------------
# US-location detection
# --------------------------------------------------------------------------
_US_STATE_CODES = (
    "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO "
    "MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC"
).split()
_US_STATE_NAMES = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
    "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
    "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine",
    "maryland", "massachusetts", "michigan", "minnesota", "mississippi",
    "missouri", "montana", "nebraska", "nevada", "new hampshire", "new jersey",
    "new mexico", "new york", "north carolina", "north dakota", "ohio",
    "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina",
    "south dakota", "tennessee", "texas", "utah", "vermont", "virginia",
    "washington", "west virginia", "wisconsin", "wyoming",
]
_US_CITIES = [
    "san francisco", "bay area", "new york", "seattle", "austin", "boston",
    "chicago", "los angeles", "san jose", "denver", "atlanta", "mountain view",
    "menlo park", "palo alto", "sunnyvale", "cupertino", "bellevue", "redmond",
    "washington, d.c", "washington dc", "san diego", "dallas", "houston",
    "fort worth", "miami", "philadelphia", "phoenix", "portland", "nashville",
    "charlotte", "raleigh", "salt lake city", "minneapolis", "detroit",
    "pittsburgh", "san antonio", "columbus", "cleveland", "kansas city",
    "santa monica", "santa clara", "irvine", "boulder", "brooklyn",
]
_US_PHRASES = [
    "united states", "u.s.a", "u.s.", "usa", "remote us", "us remote",
    "us-remote", "remote, us", "remote - us", "remote-us",
]

_NONUS_TERMS = [
    # Regions
    "emea", "apac", "latam", "asia pacific", "asia-pacific",
    # Countries
    "canada", "united kingdom", "england", "scotland", "wales", "ireland",
    "germany", "france", "spain", "portugal", "netherlands", "belgium",
    "switzerland", "austria", "italy", "poland", "czech", "romania", "sweden",
    "norway", "denmark", "finland", "india", "singapore", "australia",
    "new zealand", "japan", "china", "hong kong", "taiwan", "south korea",
    "korea", "brazil", "mexico", "argentina", "colombia", "chile", "peru",
    "israel", "united arab emirates", "uae", "south africa", "nigeria",
    "kenya", "egypt", "turkey", "ukraine", "philippines", "vietnam",
    "thailand", "indonesia", "malaysia", "pakistan", "bangladesh",
    # Non-US cities
    "london", "manchester", "dublin", "berlin", "munich", "hamburg", "paris",
    "amsterdam", "rotterdam", "madrid", "barcelona", "lisbon", "milan", "rome",
    "zurich", "geneva", "stockholm", "oslo", "copenhagen", "helsinki",
    "warsaw", "krakow", "prague", "bucharest", "bangalore", "bengaluru",
    "hyderabad", "mumbai", "new delhi", "gurgaon", "gurugram", "pune",
    "chennai", "noida", "sydney", "melbourne", "brisbane", "auckland",
    "toronto", "vancouver", "montreal", "ottawa", "calgary", "tel aviv",
    "tokyo", "osaka", "beijing", "shanghai", "shenzhen", "guangzhou",
    "sao paulo", "são paulo", "rio de janeiro", "mexico city", "dubai",
    "abu dhabi", "buenos aires", "bogota", "santiago", "lima", "singapore",
]

_US_CODE_RE = re.compile(r",\s*(" + "|".join(_US_STATE_CODES) + r")\b")
_US_WORD_RE = re.compile(r"\b(us|usa)\b")
_NONUS_CODE_RE = re.compile(
    r"\b(uk|u\.k\.|can|gbr|deu|ind|fra|esp|nld|aus|bra|sgp|irl|che|swe)\b"
)


def is_us_location(location):
    """Classify a location string.

    Returns True (US), False (clearly non-US), or None (unknown/ambiguous).
    Checks US signals first, so a multi-location posting available in the US
    (e.g. "CA, USA; Toronto, CAN") is treated as US.
    """
    if not location or not location.strip():
        return None
    s = location.lower()

    if any(p in s for p in _US_PHRASES):
        return True
    if any(c in s for c in _US_CITIES):
        return True
    if any(n in s for n in _US_STATE_NAMES):
        return True
    if _US_CODE_RE.search(location):  # state codes are upper-case in source
        return True
    if _US_WORD_RE.search(s):
        return True

    if any(t in s for t in _NONUS_TERMS):
        return False
    if _NONUS_CODE_RE.search(s):
        return False

    return None


def make_job(role, company, level, link, summary, deadline, source, location="", posted=""):
    return {
        "role": (role or "").strip(),
        "company": (company or "").strip(),
        "experience_level": level,
        "link": (link or "").strip(),
        "summary": summary,
        "deadline": deadline or "Not specified",
        "posted": (posted or "").strip(),
        "location": (location or "").strip(),
        "source": source,
    }


# --------------------------------------------------------------------------
# Date helpers (normalize each source's date format to YYYY-MM-DD)
# --------------------------------------------------------------------------
def iso_to_date(value):
    """ISO-8601 string -> 'YYYY-MM-DD' (or '' on failure)."""
    if not value:
        return ""
    try:
        s = str(value).replace("Z", "+00:00")
        return datetime.fromisoformat(s).date().isoformat()
    except (ValueError, TypeError):
        return str(value)[:10]


def epoch_ms_to_date(value):
    """Epoch milliseconds -> 'YYYY-MM-DD' (or '' on failure)."""
    try:
        return datetime.fromtimestamp(int(value) / 1000, tz=timezone.utc).date().isoformat()
    except (ValueError, TypeError):
        return ""


# --------------------------------------------------------------------------
# Link verification (ensures the output only has active, working apply links)
# --------------------------------------------------------------------------
def validate_url(url):
    """Return (status, final_url).

    status is one of:
      - "active":     link resolves (HTTP < 400)
      - "dead":       link is gone (HTTP 404/410)
      - "unverified": blocked/transient (403/429/5xx/timeout) - kept, not dropped
    """
    if not url:
        return "dead", url
    try:
        r = requests.head(url, headers=HEADERS, timeout=10, allow_redirects=True)
        if r.status_code in (400, 403, 405):  # some hosts reject HEAD
            r = requests.get(
                url, headers=HEADERS, timeout=12, allow_redirects=True, stream=True
            )
            r.close()
        code, final = r.status_code, (r.url or url)
    except requests.RequestException:
        return "unverified", url

    if code in (404, 410):
        return "dead", final
    if code < 400:
        return "active", final
    return "unverified", final


def validate_jobs(jobs, workers=None):
    """Concurrently verify each job's link. Drops dead links and rewrites the
    link to its resolved final URL. Returns (kept_jobs, dead_count)."""
    if not jobs:
        return jobs, 0
    workers = workers or config.LINK_CHECK_WORKERS
    with ThreadPoolExecutor(max_workers=workers) as ex:
        results = list(ex.map(lambda j: validate_url(j.get("link", "")), jobs))

    kept, dead = [], 0
    for job, (status, final) in zip(jobs, results):
        if status == "dead":
            dead += 1
            continue
        if status == "active" and final and final.startswith("http"):
            job["link"] = final
        kept.append(job)
    return kept, dead
