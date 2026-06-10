"""Curated company career boards to crawl directly (the "company-specific
websites" source).

Each entry is the company's public ATS board token. These were verified to
return live postings. Add or remove tokens freely - dead/empty boards are
skipped automatically at crawl time.

How to find a token:
  - Greenhouse: boards.greenhouse.io/<token>  -> use <token>
  - Lever:      jobs.lever.co/<token>          -> use <token>
  - Ashby:      jobs.ashbyhq.com/<token>        -> use <token>
"""

GREENHOUSE = [
    "stripe", "databricks", "robinhood", "airtable", "gitlab", "coinbase",
    "dropbox", "reddit", "instacart", "figma", "pinterest", "lyft", "asana",
    "brex", "affirm", "samsara", "discord", "twilio",
]

LEVER = [
    "palantir", "spotify",
]

ASHBY = [
    "ramp", "linear", "notion", "openai", "deel",
]
