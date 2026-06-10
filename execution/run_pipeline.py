"""End-to-end pipeline: crawl PM roles -> build Excel -> email the workbook.

Run:  python execution/run_pipeline.py
      python execution/run_pipeline.py --no-email   (skip sending; just build)
"""
import sys

import build_excel
import crawl_jobs
import send_email


def main():
    no_email = "--no-email" in sys.argv

    payload = crawl_jobs.main()
    workbook_paths = build_excel.build(payload)

    # Keep the website Job Tracker in sync with the latest crawl.
    import export_jobs_web

    export_jobs_web.main()

    if no_email:
        print("Skipping email (--no-email). Workbooks ready at:")
        for p in workbook_paths:
            print(f"  {p}")
        return

    try:
        send_email.send(
            workbook_paths,
            counts=payload.get("counts"),
            health=payload.get("health"),
        )
    except RuntimeError as e:
        print(f"\nWorkbooks built but NOT emailed: {e}")
        for p in workbook_paths:
            print(f"  {p}")
        print("Website jobs.json was still updated.")


if __name__ == "__main__":
    main()
