# PM Launch Lab Website Specification

## Project Overview

Build a modern, playful, feminine, high-converting personal brand website for Sammy Lydia.

The website should position Sammy as:

* Product Manager
* PM Career Coach
* Mentor
* AI-era PM Educator
* Creator of digital PM resources

The visual style should feel:

* Warm
* Intelligent
* Approachable
* Modern
* Slightly playful
* Professional enough for Microsoft-level credibility
* Cute without being childish

Think:

"Notion + Duolingo + Canva + LinkedIn Creator"

---

# Brand

## Brand Name

PM Launch Lab

## Tagline

Helping aspiring Product Managers break into PM careers through coaching, resources, and AI-era career guidance.

## Mission

Make Product Management more accessible for students, career switchers, and aspiring PMs.

---

# Primary Goals

1. Establish credibility
2. Generate coaching leads
3. Sell digital products
4. Grow newsletter subscribers
5. Build a PM community
6. Create long-term personal brand

---

# User Personas

## Persona 1

College Student

Goals:

* PM internships
* Resume help
* Career direction

Pain Points:

* Doesn't know where to start

---

## Persona 2

Career Switcher

Goals:

* Transition into PM

Pain Points:

* Lack of PM experience
* Interview anxiety

---

## Persona 3

New Grad / Recent Graduate

Goals:

* Land a first full-time PM or APM role out of college
* Convert a PM internship into a return offer

Pain Points:

* No prior PM title or full-time experience
* Competing against more experienced candidates in a tough market

> NOTE: Target audience is people trying to break into Product Management —
> college students seeking PM internships, new grads, and career switchers.
> Experienced / mid-career PMs looking to "level up" are explicitly NOT a
> target customer.

---

# Design Requirements

## Design Style

Cute Professional

Characteristics:

* Rounded corners
* Soft gradients
* Hand-drawn accents
* Friendly illustrations
* Animated microinteractions
* Smooth scrolling

Avoid:

* Corporate blue overload
* Generic startup design
* Dark intimidating UI

---

## Suggested Color Palette

Primary:

* Lavender (#A78BFA)

Secondary:

* Soft Pink (#F9A8D4)

Accent:

* Mint (#6EE7B7)

Background:

* Warm White (#FAFAFA)

Text:

* Charcoal (#1F2937)

Success:

* Emerald (#10B981)

---

## Typography

Headings:

* Poppins

Body:

* Inter

Accent:

* Nunito

---

# Site Map

## Home

## About

## Coaching

## Resources

## Job Tracker

## Blog

## Testimonials

## Newsletter

## Contact

---

# Homepage

## Hero Section

Large welcoming hero.

Photo of Sammy.

Headline:

Helping Future Product Managers Launch Their Careers

Subheadline:

Coaching, templates, interview prep, and AI-era PM guidance.

Primary CTA:

Book a Discovery Call

Secondary CTA:

Explore Resources

Include subtle floating elements:

* rockets
* notebooks
* checklists
* sticky notes

---

## Credibility Section

Show:

* Product Manager
* Microsoft
* PM Mentor
* Career Coach

Metrics:

* Students coached
* Resumes reviewed
* Mock interviews conducted

Must support future editing.

---

## Services Preview

Cards:

### PM Career Strategy

### Resume Reviews

### Mock Interviews

### PM Launch Program

Each card should have animation.

---

## Testimonials

Carousel.

Support:

* text
* photo
* LinkedIn link

---

## Newsletter CTA

Headline:

Get PM Opportunities & Career Tips Weekly

Email capture.

---

# About Page

Story-focused.

Sections:

* My Journey
* Breaking into PM
* Lessons Learned
* Why I Started PM Launch Lab

Timeline component preferred.

---

# Coaching Page

## Services

### Career Clarity Session

### Resume Review

### LinkedIn Optimization

### Interview Prep

### PM Launch Program

Each service should include:

* Description
* Outcomes
* Pricing
* CTA

Calendly integration.

---

# Resources Store

Digital products marketplace.

Categories:

## Templates

Examples:

* Resume Templates
* Interview Tracker
* PM Learning Roadmap

## Job Search Resources

Examples:

* Internship Tracker
* Full-Time PM Tracker
* Networking Tracker

## AI for PM

Examples:

* Prompt Libraries
* PM AI Toolkit

Support:

* Stripe Checkout
* Instant download
* Product previews

---

# Job Tracker Section

This is a flagship feature.

Purpose:

Help aspiring PMs find opportunities.

Categories:

## PM Internships

## Associate PM Roles

## Product Analyst Roles

## Full-Time PM Roles

Features:

* Search
* Filter
* Save
* Sort

Each role should show:

* Company
* Role
* Location
* Link

Admin dashboard should allow manual updates.

---

# Blog

Categories:

* PM Careers
* AI for PMs
* Resume Tips
* Interview Prep
* Microsoft Learnings
* Career Growth

SEO optimized.

---

# Newsletter

Purpose:

Build audience.

Name:

The PM Launch Letter

Weekly topics:

* Open PM Roles
* Internship Roundups
* AI Tools
* PM Career Advice

Integrate:

* Beehiiv or ConvertKit

---

# Testimonials

Dedicated page.

Include:

* Written reviews
* LinkedIn recommendations
* Success stories

---

# Contact

Fields:

* Name
* Email
* Goal
* Message

Integrate email service.

---

# Community (Future Phase)

Build community section.

Future integrations:

* Circle
* Discord
* Slack

Not required in MVP.

---

# Technical Stack

Frontend:

* Next.js 15
* TypeScript
* Tailwind CSS
* Framer Motion

Backend:

* Supabase

Database:

* PostgreSQL

Authentication:

* Clerk

Payments:

* Stripe

Email:

* Resend

CMS:

* Sanity CMS

Hosting:

* Vercel

Analytics:

* PostHog

---

# SEO

Keywords:

* Product Management Coaching
* PM Career Coach
* PM Interview Prep
* Product Manager Career Advice
* Break Into Product Management
* PM Internship Resources

Every page must support metadata.

---

# Performance

Lighthouse score target:

95+

Requirements:

* Mobile first
* Responsive
* Accessible
* Fast loading

---

# Future Features

Phase 2:

* AI Resume Reviewer
* AI PM Career Coach Chatbot
* PM Interview Simulator
* Community Platform
* Paid Membership

Phase 3:

* Courses
* Cohorts
* Certification Programs

---

# Success Metrics

Track:

* Discovery call bookings
* Resource purchases
* Newsletter signups
* Contact submissions
* Blog traffic
* Revenue

Primary KPI:

Monthly Coaching Revenue

Secondary KPI:

Newsletter Growth

---

# Build Notes & Learnings (living section)

Status: **MVP scaffold complete and building cleanly.** Lives in `website/`
(kept separate from the Python job crawler).

## What was built
- All 9 sitemap pages (Home, About, Coaching, Resources, Job Tracker, Blog +
  posts, Testimonials, Newsletter, Contact) + 404, sitemap.xml, robots.txt.
- Design system in `src/app/globals.css` (lavender/pink/mint/cream palette,
  Poppins/Inter/Nunito, soft gradients, floating animations, reduced-motion).
- Animated microinteractions via Framer Motion; testimonials carousel; animated
  metric counters; mobile nav.
- API stubs (key-ready): `api/newsletter` (ConvertKit/Beehiiv), `api/contact`
  (Resend), `api/checkout` (Stripe), `api/resume-review` (Resend w/ attachment).
- Resume Review books via a dedicated flow (`/coaching/resume-review`): the
  client uploads their resume (PDF/Word, ≤8 MB) → it's emailed to Sammy via
  Resend → then they pay → then Calendly to pick a time. Calendly can't accept
  file uploads, so the resume is captured on-site first.

## Social proof: no fabricated stats (current)
- All placeholder testimonials and fake metrics (incl. the "4.9/5" rating and
  "120+ students" counts) were removed — the brand is new and shouldn't show
  unverified social proof. `metrics` and `testimonials` in `src/lib/data.ts` /
  `src/lib/site.ts` are now empty and render nothing until real data is added.
- The "Testimonials" page is repurposed as **Reviews & Feedback** (nav label
  "Reviews", route still `/testimonials`): empty-state + a star-rating feedback
  form. Submissions hit `POST /api/feedback` and are captured PRIVATELY (stub
  logs now; email via Resend or insert into a Supabase `feedback` table later).
  Nothing posts publicly automatically — Sammy reviews feedback in the future
  dashboard and promotes selected reviews into `testimonials` to feature them.
  The homepage testimonials carousel was removed for now.

## Coaching offers & pay-then-book (current)
- **PM Launch Program is temporarily removed** from the live site (per Sammy —
  will reintroduce after market testing). Spec section above is kept for the
  future re-add; the website's `services` array in `src/lib/data.ts` omits it.
- Live paid services & prices: Career Clarity $120/session, Resume Review $100
  (includes complimentary LinkedIn optimization), LinkedIn Optimization $110,
  Interview Prep $100 **per session** (one mock interview).
- **Pay before meeting:** paid services use a pay-then-book flow — `BookButton`
  → `POST /api/book` creates a Stripe Checkout Session (inline `price_data`, so
  just `STRIPE_SECRET_KEY` is needed, no pre-created Prices) → success redirects
  to `/coaching/booked` → Calendly. The **free discovery call** (navbar/hero/
  contact) still links straight to Calendly. Until Stripe is keyed, `/api/book`
  returns a friendly "payments not live yet" message.
- All editable content centralized in `src/lib/site.ts` and `src/lib/data.ts`.

## Stack reality vs. spec
- Spec said Next.js 15; `create-next-app` now ships **Next.js 16** (used latest).
- **Tailwind v4** uses a CSS-based `@theme` (no `tailwind.config.js`).
- **lucide-react v1 removed brand logos** (LinkedIn/Twitter/YouTube). Added
  inline SVG brand icons in `src/components/ui/BrandIcons.tsx`.

## Job Tracker ↔ crawler (flagship)
Connected to the existing crawler. Refresh flow:
```
.venv/bin/python execution/run_pipeline.py --no-email   # crawl
.venv/bin/python execution/export_jobs_web.py           # -> website/src/data/jobs.json
```
`export_jobs_web.py` categorizes into PM Internships / Associate PM / Product
Analyst / Full-Time PM. Note: the crawler excludes "product analyst" roles, so
that category is usually 0 — relax `is_pm_role` in `execution/common.py` if those
are wanted. Initial export = 278 real roles.

## Environment / tooling gotchas
- The Next dev server calls `os.networkInterfaces()`, which the sandbox blocks
  (`uv_interface_addresses ... Unknown system error 1`). Run dev/build **outside
  the sandbox** (full permissions). Default dev port 3000; falls back to 3001.
- Run `npm` commands from inside `website/` (an early install accidentally
  created a stray root `package.json`/`node_modules` — clean those if they
  reappear).

## To go live
Fill `website/.env.local` (see `.env.example`) and follow the `STUB:` comments
in the three API routes. Deploy `website/` to Vercel.
