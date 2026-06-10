"""Email the generated Excel workbooks as attachments via SMTP (Gmail).

Attaches both deliverables (internships + full-time) to a single email.

Requires the following in .env:
  EMAIL_FROM, EMAIL_APP_PASSWORD, EMAIL_TO (and optionally SMTP_HOST/PORT)

Run:  python execution/send_email.py [workbook1.xlsx workbook2.xlsx ...]
If no paths are given, the most recent internships + full-time files are sent.
"""
import smtplib
import ssl
import sys
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path

import config


def _latest_workbooks():
    paths = []
    for pattern in ("pm_internships_*.xlsx", "pm_fulltime_*.xlsx"):
        files = sorted(config.OUTPUT_DIR.glob(pattern))
        if files:
            paths.append(files[-1])
    if not paths:
        raise FileNotFoundError(
            "No workbooks found in output/. Run build_excel.py first."
        )
    return paths


def send(attachment_paths=None, counts=None, health=None):
    if not config.EMAIL_FROM or not config.EMAIL_APP_PASSWORD:
        raise RuntimeError(
            "Email not configured. Set EMAIL_FROM and EMAIL_APP_PASSWORD in .env "
            "(use a Gmail App Password: https://myaccount.google.com/apppasswords)."
        )

    if attachment_paths is None:
        attachment_paths = _latest_workbooks()
    elif isinstance(attachment_paths, (str, Path)):
        attachment_paths = [Path(attachment_paths)]
    else:
        attachment_paths = [Path(p) for p in attachment_paths]
    date_str = datetime.now().strftime("%B %d, %Y")

    counts = counts or {}
    intern_n = counts.get("internships", "")
    full_n = counts.get("fulltime", "")
    summary_line = ""
    if intern_n != "" and full_n != "":
        summary_line = f"\nThis batch contains {full_n} full-time roles and {intern_n} internships."

    # Build a per-source breakdown and any health warnings.
    health = health or {}
    breakdown = ""
    source_counts = health.get("source_counts") or {}
    if source_counts:
        lines = "\n".join(f"  - {name}: {n}" for name, n in source_counts.items())
        breakdown = f"\n\nSources crawled this run:\n{lines}"

    warning_block = ""
    if health.get("down"):
        warning_block = (
            "\n\n[!] Heads up: these sources returned 0 results and may have "
            "changed their format - the list could be incomplete: "
            + ", ".join(health["down"])
        )

    msg = EmailMessage()
    msg["Subject"] = f"Open Product Management Roles - {date_str}"
    msg["From"] = config.EMAIL_FROM
    msg["To"] = config.EMAIL_TO
    msg.set_content(
        f"Hi Lydia,\n\n"
        f"Attached are the latest open Product Management roles in two separate "
        f"Excel files: one for Internships and one for Full-Time "
        f"positions.{summary_line}\n\n"
        f"Each row includes the role, level of experience required, a link to "
        f"apply, a summary of the job description, the application deadline "
        f"(where the source provides one), and the date posted.\n\n"
        f"All listings were pulled fresh today and every apply link was checked "
        f"to be active before sending."
        f"{breakdown}{warning_block}\n\n"
        f"-- Your PM Job Automation"
    )

    for path in attachment_paths:
        msg.add_attachment(
            path.read_bytes(),
            maintype="application",
            subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=path.name,
        )

    context = ssl.create_default_context()
    with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(config.EMAIL_FROM, config.EMAIL_APP_PASSWORD)
        server.send_message(msg)

    names = ", ".join(p.name for p in attachment_paths)
    print(f"Email sent to {config.EMAIL_TO} with attachments: {names}")


if __name__ == "__main__":
    paths = sys.argv[1:] or None
    send(paths)
