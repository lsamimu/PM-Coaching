# PM Launch Lab — Launch checklist

Your **code is ready**. Finish these dashboard steps to go live.

## Phase 1 — GitHub (15 min)

- [x] Create a new GitHub repo (private or public)
- [x] Remote is set to `https://github.com/lsamimu/PM-Coaching.git` — push from your machine:
  ```bash
  cd "/Users/lydiasammy/Documents/PM Coaching"
  git push -u origin main
  ```
  (GitHub will prompt you to sign in, or use a [Personal Access Token](https://github.com/settings/tokens) as the password.)
- [ ] Repo → **Settings → Actions → General** → allow workflows to **read and write**
- [ ] Repo → **Settings → Secrets → Actions** → add:
  - `EMAIL_TO` = your Gmail
  - `EMAIL_FROM` = your Gmail
  - `EMAIL_APP_PASSWORD` = Gmail app password

## Phase 2 — Vercel (15 min)

- [x] [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo
- [x] **Root Directory:** `website`
- [x] Add environment variables (copy from `website/.env.local`):
  - `NEXT_PUBLIC_SITE_URL` = **`https://pm-coaching.vercel.app`** (switch to `https://pmlaunchlab.com` after domain DNS)
  - All Supabase, Resend, Venmo, and `ACCESS_TOKEN_SECRET` keys
- [x] Deploy — live at **https://pm-coaching.vercel.app**

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
