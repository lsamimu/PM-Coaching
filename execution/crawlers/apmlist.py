"""APM List (apmlist.com) — curated Associate Product Manager programs.

The site is a Next.js app that embeds its full dataset in the page's
`__NEXT_DATA__` script. We parse that JSON to get two lists: `fulltime`
(APM programs) and `internship`. Each entry has a Company, an apply URL, a
Status (used as availability/deadline), salary, and tags.
"""
import json
import re
import sys

from . import util

URL = "https://apmlist.com/"


def _find_list(obj, key):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == key and isinstance(v, list):
                return v
            found = _find_list(v, key)
            if found is not None:
                return found
    elif isinstance(obj, list):
        for item in obj:
            found = _find_list(item, key)
            if found is not None:
                return found
    return None


def _entry_to_job(entry, is_intern):
    company = entry.get("Company", "")
    entry_type = entry.get("Type", "")  # "APM" or "Internship"
    status = entry.get("Status", "")
    salary = entry.get("Salary", "")
    tags = ", ".join(entry.get("Tags", []) or [])

    if is_intern:
        role = f"{company} Product Management Internship"
        level = "Internship"
    else:
        role = f"{company} {entry_type or 'APM'} Program"
        level = "Entry / Associate (New Grad)"

    summary_bits = [f"Curated {entry_type or 'APM'} program from APM List."]
    if salary:
        summary_bits.append(f"Salary: {salary}.")
    if tags:
        summary_bits.append(f"Tags: {tags}.")
    if status:
        summary_bits.append(f"Status: {status}.")

    return util.make_job(
        role=role,
        company=company,
        level=level,
        link=entry.get("URL", ""),
        summary=" ".join(summary_bits),
        deadline=status or "Not specified",  # e.g. "Not Yet Open", "Closed for 2026"
        source="APM List",
        location="See posting",
    )


def crawl():
    jobs = []
    try:
        r = util.get(URL)
        blob = re.search(
            r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
            r.text,
            re.S,
        )
        if not blob:
            raise ValueError("Could not locate __NEXT_DATA__ on apmlist.com")
        data = json.loads(blob.group(1))

        for entry in _find_list(data, "fulltime") or []:
            jobs.append(_entry_to_job(entry, is_intern=False))
        for entry in _find_list(data, "internship") or []:
            jobs.append(_entry_to_job(entry, is_intern=True))
    except Exception as e:  # noqa: BLE001
        print(f"  APM List FAILED: {e}", file=sys.stderr)
    print(f"  APM List: {len(jobs)} programs")
    return jobs
