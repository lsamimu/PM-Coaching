"""Shared configuration and helpers for the PM job automation.

Loads environment variables from .env and defines the constants used across
the crawl -> build_excel -> send_email pipeline.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

# Project root is the parent of the execution/ folder.
ROOT = Path(__file__).resolve().parent.parent
TMP_DIR = ROOT / ".tmp"
OUTPUT_DIR = ROOT / "output"

# Load .env from the project root (if present).
load_dotenv(ROOT / ".env")

# Intermediate + deliverable file locations.
JOBS_JSON = TMP_DIR / "jobs.json"

# ---- Email settings ----
EMAIL_TO = os.getenv("EMAIL_TO", "sammy.lydia26@gmail.com")
EMAIL_FROM = os.getenv("EMAIL_FROM", "")
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD", "")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

# ---- Web-wide aggregators ----
# The Muse (no key): how many pages of the Product Management feed to pull
# (20 pages ~= up to 400 postings before filtering).
THEMUSE_MAX_PAGES = int(os.getenv("THEMUSE_MAX_PAGES", "20"))

# Adzuna (optional, free key at https://developer.adzuna.com/)
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")
ADZUNA_COUNTRY = os.getenv("ADZUNA_COUNTRY", "us")

# JSearch / Google for Jobs (optional, RapidAPI key at
# https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")

# USAJOBS (optional, free key at https://developer.usajobs.gov/apirequest/)
USAJOBS_API_KEY = os.getenv("USAJOBS_API_KEY", "")
USAJOBS_EMAIL = os.getenv("USAJOBS_EMAIL", "")

# ---- Location scope ----
# When US_ONLY is true, postings whose location is clearly outside the United
# States are dropped. Postings with an unknown/unparseable location are kept
# when KEEP_UNKNOWN_LOCATION is true (e.g. APM List rows have no location but
# are US-focused programs).
US_ONLY = os.getenv("US_ONLY", "true").lower() in ("1", "true", "yes")
KEEP_UNKNOWN_LOCATION = os.getenv("KEEP_UNKNOWN_LOCATION", "true").lower() in ("1", "true", "yes")

# ---- Freshness / active-listing verification ----
# When true, every apply link is checked and postings whose link is dead
# (HTTP 404/410) are dropped, so the output only contains active positions.
# Links are also resolved to their final URL so the user gets the correct link.
VERIFY_LINKS = os.getenv("VERIFY_LINKS", "true").lower() in ("1", "true", "yes")
LINK_CHECK_WORKERS = int(os.getenv("LINK_CHECK_WORKERS", "16"))

# Optional: drop postings older than N days when a post date is known.
# 0 disables age filtering (default) - many real roles stay open for months.
MAX_AGE_DAYS = int(os.getenv("MAX_AGE_DAYS", "0"))

# Search terms used to identify Product Management roles.
PM_SEARCH_TERMS = [
    "product manager",
    "product management",
    "associate product manager",
    "product owner",
    "product intern",
]

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
]

# Keywords that mark a posting as an internship.
INTERNSHIP_KEYWORDS = ["intern", "internship", "co-op", "coop", "co op"]


def ensure_dirs():
    """Create the intermediate and output directories if they don't exist."""
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
