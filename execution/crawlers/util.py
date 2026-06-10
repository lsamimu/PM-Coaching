"""Shared helpers for all source crawlers: HTTP, text cleaning, classification."""
import html
import re

import requests

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}
TIMEOUT = 30

# Keywords that confirm a posting is a Product Management role.
PM_KEYWORDS = [
    "product manager",
    "product management",
    "product owner",
    "associate product manager",
    "group product manager",
    "director of product",
    "head of product",
    "vp of product",
    "vp product",
    "chief product officer",
    "product lead",
    "apm",
]

INTERNSHIP_KEYWORDS = ["intern", "internship", "co-op", "coop", "co op"]


def get(url, params=None, timeout=TIMEOUT):
    """GET with shared headers; raises for HTTP errors."""
    r = requests.get(url, params=params, headers=HEADERS, timeout=timeout)
    r.raise_for_status()
    return r


def strip_html(text):
    if not text:
        return ""
    text = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def summarize(text, limit=600):
    clean = strip_html(text)
    if len(clean) <= limit:
        return clean
    return clean[:limit].rsplit(" ", 1)[0] + "..."


def is_pm_role(title, description=""):
    """True only when the TITLE clearly denotes a Product Management role.

    Matching on the title (not the description) avoids false positives like
    "Product Designer" or "Engineering Manager, Product" whose descriptions
    merely mention a product manager.
    """
    haystack = (title or "").lower()
    for kw in PM_KEYWORDS:
        if kw == "apm":
            if re.search(r"\bapm\b", haystack):
                return True
        elif kw in haystack:
            return True
    return False


def is_internship(title, job_type="", level=""):
    """Word-boundary match so "international"/"internal" are not internships."""
    blob = " ".join([title or "", job_type or "", level or ""]).lower()
    return bool(re.search(r"\b(intern|internship|co-?op)\b", blob))


def experience_level(title, description="", explicit_level=""):
    """Infer the level of experience required from available signals."""
    if explicit_level:
        return explicit_level.strip().title()

    blob = (title or "").lower()
    # Word-boundary check first so "international"/"internal" are not internships.
    if re.search(r"\b(intern|internship|co-?op)\b", blob):
        return "Internship"
    checks = [
        (["chief product", "cpo"], "Executive (CPO)"),
        (["vp ", "vice president", "head of product"], "VP / Head of Product"),
        (["director"], "Director"),
        (["principal"], "Principal"),
        (["staff"], "Staff"),
        (["group product manager", "gpm"], "Group PM (Senior)"),
        (["senior", "sr.", "sr ", "lead"], "Senior"),
        (["associate", "junior", "jr.", "jr ", "entry", "graduate",
          "new grad", "early career", "apm", "university"], "Entry / Associate"),
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


def make_job(role, company, level, link, summary, deadline, source, location=""):
    return {
        "role": (role or "").strip(),
        "company": (company or "").strip(),
        "experience_level": level,
        "link": (link or "").strip(),
        "summary": summary,
        "deadline": deadline or "Not specified",
        "location": (location or "").strip(),
        "source": source,
    }
