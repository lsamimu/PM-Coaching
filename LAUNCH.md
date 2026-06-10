# PM Launch Lab — Launch checklist

Your **code is ready**. Finish these dashboard steps to go live.

## Phase 1 — GitHub (15 min)

- [ ] Create a new GitHub repo (private or public)
- [ ] From this folder:
  ```bash
  git remote add origin https://github.com/YOU/pm-launch-lab.git
  git push -u origin main
  ```
- [ ] Repo → **Settings → Actions → General** → allow workflows to **read and write**
- [ ] Repo → **Settings → Secrets → Actions** → add:
  - `EMAIL_TO` = your Gmail
  - `EMAIL_FROM` = your Gmail
  - `EMAIL_APP_PASSWORD` = Gmail app password

## Phase 2 — Vercel (15 min)

- [ ] [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo
- [ ] **Root Directory:** `website`
- [ ] Add environment variables (copy from `website/.env.local`):
  - `NEXT_PUBLIC_SITE_URL` = **`https://pmlaunchlab.com`** (not localhost)
  - All Supabase, Resend, Venmo, and `ACCESS_TOKEN_SECRET` keys
- [ ] Deploy

## Phase 3 — Domain & email (30 min)

- [ ] Vercel → **Domains** → add `pmlaunchlab.com` → update DNS at registrar
- [ ] Resend → **Domains** → verify `pmlaunchlab.com`
- [ ] Update Vercel env: `CONTACT_FROM="PM Launch Lab <hello@pmlaunchlab.com>"`

## Phase 4 — Smoke tests

- [ ] `https://pmlaunchlab.com/pm-roles` — Venmo + submit form
- [ ] Approve email → access link → unlocked tracker
- [ ] `/contact` — message arrives
- [ ] `/newsletter` — welcome email arrives
- [ ] GitHub Actions → **Daily PM Job Digest** → Run workflow → `jobs.json` commits

## Already done in code

- PM Roles Venmo + approve flow
- Supabase entitlements table
- Resend for contact, resume review, feedback, newsletter
- Daily job crawl → auto-updates `website/src/data/jobs.json`
- Website CI build on push

## Local commands

```bash
# Dev server
cd website && npm run dev

# Refresh job data manually
./scripts/refresh-jobs.sh

# Production build check
cd website && npm run build
```
