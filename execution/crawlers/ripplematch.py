"""RippleMatch (ripplematch.com).

RippleMatch is an early-career matching platform whose job listings sit behind
an authenticated student account — there is no public, unauthenticated jobs
feed to crawl. Without login credentials (and absent the user's permission to
automate their account), this source cannot be crawled responsibly.

This module is a placeholder so the source is visible in the pipeline and easy
to enable later if the user provides an authenticated session / API access.
"""


def crawl():
    print(
        "  RippleMatch: 0 (skipped — login-gated, no public jobs feed; "
        "needs an authenticated account)"
    )
    return []
