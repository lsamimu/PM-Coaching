# PM Launch Lab — Notion Resources Build SOP

Build the **actual customer-facing Notion workspaces** for all four premium products:

| Product | Slug | Price |
|---|---|---|
| From Non-Technical to PM (Flagship Playbook) | `non-technical-to-pm` | $99 |
| PM Job Search Command Center | `pm-job-search-command-center` | $79 |
| PM Networking OS | `pm-networking-os` | $69 |
| PM Interview Prep OS | `pm-interview-prep-os` | $89 |

Source of truth for structure: `website/src/lib/products.ts`

---

## What I need from you (before building)

### 1. Notion account & workspace (you create — I cannot)

I **cannot** create a Notion account on your behalf (requires your email, password, and 2FA).

**You do this once (~5 min):**

1. Sign up at [notion.so](https://www.notion.so) (free plan works for building; Team plan needed later for bulk duplicate links).
2. Create a workspace named **PM Launch Lab** (or tell me the name you prefer).
3. Create a top-level page: **PM Launch Lab — Master Templates** (this is where all product workspaces live).

### 2. Notion integration token

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations).
2. **New integration** → name: `PM Launch Lab Builder`.
3. Copy the **Internal Integration Secret** (starts with `ntn_` or `secret_`).
4. Add to `.env` at repo root:

```bash
NOTION_TOKEN=ntn_xxxxxxxx
NOTION_PARENT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Parent page ID:** Open "PM Launch Lab — Master Templates" in Notion → Share → Copy link. The ID is the 32-char hex in the URL:
`https://www.notion.so/PM-Launch-Lab-Master-Templates-` **`abc123...`**

5. On that parent page: **⋯ → Connections → Add connection → PM Launch Lab Builder**.

Repeat for each workspace page the integration needs to edit.

### 3. Content only you can provide

| Item | Why I need it |
|---|---|
| **Sammy's Journey** (Playbook) | Real story: non-technical → Microsoft PM. 300–800 words. |
| **Headshot / brand** | Cover images for each workspace (optional but recommended). |
| **Sample data tone** | Fictional companies (Stripe, Microsoft) OK? Or anonymized real examples? |
| **Delivery model** | See decision below — affects how we structure pages. |

### 4. Delivery model (pick one)

**Option A — Duplicate-link templates (recommended for digital products)**  
- Build 4 **template pages** in your workspace.  
- Enable "Allow duplicate as template" on each.  
- After Stripe purchase → email customer the duplicate link.  
- Customer gets a private copy in *their* Notion.

**Option B — Single shared workspace**  
- One workspace, sections per product.  
- Simpler to build; worse for paid products (customers see each other's data).

**Default:** Option A.

### 5. Notion MCP (optional — not currently enabled)

Your Cursor setup only has **Supabase MCP**, not Notion MCP.

To enable Notion MCP later: Cursor Settings → MCP → add [Notion MCP server](https://github.com/makenotion/notion-mcp-server) with your integration token.

The build script in `execution/notion/` works without MCP.

---

## Build order

1. **Flagship Playbook** — strategy foundation; other products link back to it.
2. **Job Search Command Center** — applications pipeline.
3. **PM Networking OS** — relationships & referrals.
4. **Interview Prep OS** — question bank & practice (largest content surface).

---

## Automated build (Layer 3)

```bash
# 1. Export product spec → JSON manifest
cd website && npx --yes tsx scripts/export-notion-manifest.ts

# 2. Scaffold all workspaces in Notion (pages + databases + starter content)
cd .. && .venv/bin/python execution/notion/build_workspaces.py

# Dry run (prints plan, no API calls)
.venv/bin/python execution/notion/build_workspaces.py --dry-run
```

Requires `NOTION_TOKEN` and `NOTION_PARENT_PAGE_ID` in repo-root `.env`.

**What the script creates:**
- One child page per product under the parent
- Section pages from `notionStructure`
- Databases with inferred property types from `databases`
- Placeholder content pages for templates listed in `templates`
- Sample rows from `sampleData` where defined

**What still needs manual polish after scaffold:**
- Question bank (80+ rows for Interview Prep OS)
- Outreach template copy (15 messages for Networking OS)
- Playbook curriculum content (PM fundamentals modules)
- Dashboard views, formulas, and linked database relations
- Cover images & icon styling
- "Duplicate as template" toggle on each product root page

---

## Post-build: customer delivery flow

1. Each product root page → **⋯ → Customize page → Allow duplicate as template**.
2. Copy duplicate link → store in Stripe product metadata or Supabase `deliverables` table.
3. Stripe webhook (`/api/checkout`) → email duplicate link on `checkout.session.completed`.
4. Test: purchase → receive link → duplicate → verify customer owns their copy.

---

## Handoff checklist

- [ ] Notion account + workspace created
- [ ] Integration token + parent page ID in `.env`
- [ ] Parent page connected to integration
- [ ] Sammy's Journey draft provided
- [ ] Delivery model confirmed (duplicate-link vs shared)
- [ ] `build_workspaces.py` run successfully
- [ ] Manual content pass complete (question bank, templates, playbook modules)
- [ ] Duplicate-as-template enabled on all 4 roots
- [ ] Stripe → email delivery wired
