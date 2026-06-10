"""Crawl the APM List (apmlist.com) - a curated table of Associate Product
Manager / new-grad PM programs and product internships at major companies.

Each table row gives: company, status (Open / Not Yet Open / Closed), program
type (APM, Internship, Rotational, ...), and an apply link. We keep rows that
are not explicitly Closed.
"""
import re
import sys

import common

URL = "https://apmlist.com/"

ROW_RE = re.compile(r'<tr class="body-row">(.*?)</tr>', re.S)
COMPANY_RE = re.compile(r'<td>(.*?)</td>', re.S)
STATUS_RE = re.compile(r'<span class="status[^"]*">(.*?)</span>', re.S)
TYPE_RE = re.compile(r'<td class="type">(.*?)</td>', re.S)
APPLY_RE = re.compile(r'href="([^"]+)"[^>]*class="as-button"')


def crawl():
    jobs = []
    try:
        r = common.polite_get(URL)
        if not r or r.status_code != 200:
            print("  APM List: unavailable", file=sys.stderr)
            return jobs

        for row in ROW_RE.findall(r.text):
            company_cells = COMPANY_RE.findall(row)
            company = common.strip_html(company_cells[0]) if company_cells else ""
            status_m = STATUS_RE.search(row)
            status = common.strip_html(status_m.group(1)) if status_m else ""
            type_m = TYPE_RE.search(row)
            ptype = common.strip_html(type_m.group(1)) if type_m else "Program"
            apply_m = APPLY_RE.search(row)
            apply_url = apply_m.group(1).replace("&amp;", "&") if apply_m else ""

            if not company or not apply_url:
                continue
            # Keep only ACTIVE programs. APM List statuses include "Open",
            # "Not Yet Open", "Closed for <year>", and "Paused" - only "Open"
            # is currently accepting applications.
            st = status.lower()
            if "open" not in st or "not yet" in st:
                continue

            is_intern = "intern" in ptype.lower()
            role = f"{ptype} (Product Management)".strip()
            level = "Internship" if is_intern else "Entry / Associate (New Grad)"
            summary = (
                f"{ptype} product-management program at {company}. "
                f"Application status on APM List: {status or 'Unknown'}."
            )
            jobs.append(
                common.make_job(
                    role=role,
                    company=company,
                    level=level,
                    link=apply_url,
                    summary=summary,
                    deadline=f"Status: {status}" if status else "Not specified",
                    source="APM List",
                    location="",
                )
            )
        print(f"  APM List: {len(jobs)} programs")
    except Exception as e:  # noqa: BLE001
        print(f"  APM List FAILED: {e}", file=sys.stderr)
    return jobs
