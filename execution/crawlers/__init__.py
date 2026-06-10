"""Crawler package: one module per job source.

Each module exposes a `crawl()` function returning a list of normalized job
dicts (see crawlers.util.make_job).
"""
