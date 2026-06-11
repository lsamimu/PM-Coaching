# Deploy to Vercel

Repo: https://github.com/lsamimu/PM-Coaching

## Step 1 — Import project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Sign in with **GitHub**
3. Import **lsamimu/PM-Coaching**
4. **Root Directory:** click Edit → enter `website` → Continue

## Step 2 — Environment variables

Before clicking Deploy, open **Environment Variables** and add each row below.
Copy **values** from `website/.env.local` on your Mac — except `NEXT_PUBLIC_SITE_URL` (see below).

| Name | Production value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://pmlaunchlab.com` *(or your `*.vercel.app` URL until domain is connected)* |
| `NEXT_PUBLIC_SUPABASE_URL` | from `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | from `.env.local` |
| `VENMO_HANDLE` | `Lydia-Sammy` |
| `PM_ROLES_PRICE_CENTS` | `1900` |
| `ACCESS_TOKEN_SECRET` | from `.env.local` |
| `RESEND_API_KEY` | from `.env.local` |
| `CONTACT_FROM` | `PM Launch Lab <onboarding@resend.dev>` *(upgrade to `@pmlaunchlab.com` after Resend domain verify)* |
| `CONTACT_TO` | `sammy.lydia26@gmail.com` |

Apply to: **Production**, **Preview**, and **Development**.

## Step 3 — Deploy

Click **Deploy**. First build takes ~2 minutes.

Your site will be live at `https://pm-coaching-xxxx.vercel.app` (exact URL on the deploy screen).

## Step 4 — Custom domain (when ready)

1. Vercel project → **Settings → Domains**
2. Add `pmlaunchlab.com` and `www.pmlaunchlab.com`
3. Add the DNS records Vercel shows at your domain registrar
4. Update `NEXT_PUBLIC_SITE_URL` to `https://pmlaunchlab.com` → **Redeploy**

## Step 5 — Auto-deploy on every push

Default behavior once connected:
- Push to `main` → Vercel rebuilds production automatically
- In Cursor: Source Control → Commit → Push

## Step 6 — Smoke test

- `/pm-roles` — Venmo button + submit form
- `/contact` — sends email
- `/newsletter` — welcome email
- Approve flow — check inbox for approve link

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails | Vercel → Deployments → View logs |
| Emails don't send | Resend → Logs; verify `CONTACT_FROM` |
| Approve links go to localhost | Fix `NEXT_PUBLIC_SITE_URL` on Vercel, redeploy |
| PM Roles re-send fails | Confirm `SUPABASE_SERVICE_ROLE_KEY` is set on Vercel |
