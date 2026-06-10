import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Access control for the one-time-purchase "Live PM Roles" list.
 *
 * - Entitlements (who paid) are stored in Supabase (table: pm_roles_access).
 * - Access is proven via short-lived, HMAC-signed magic-link tokens emailed to
 *   the buyer, then exchanged for a long-lived signed access cookie.
 * - Everything degrades gracefully in "stub mode" (no env keys) so the flow is
 *   testable locally.
 */

const SECRET =
  process.env.ACCESS_TOKEN_SECRET || "dev-insecure-secret-change-me";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const ACCESS_COOKIE = "pm_roles_access";
const MAGIC_LINK_TTL_MS = 1000 * 60 * 60; // 1 hour
const COOKIE_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year

export function priceCents(): number {
  return Number(process.env.PM_ROLES_PRICE_CENTS || 1900);
}

export function priceLabel(): string {
  const cents = priceCents();
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

type TokenPayload = { email: string; exp: number; purpose?: string };

function signPayload(payload: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

function verifyPayload(
  token?: string | null,
  purpose?: string,
): TokenPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(body)
    .digest("base64url");
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString(),
    ) as TokenPayload;
    if (!payload.email || typeof payload.exp !== "number") return null;
    if (purpose && payload.purpose !== purpose) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

/** True if this email has purchased access. */
export async function isEntitled(email: string): Promise<boolean> {
  const e = normalizeEmail(email);
  if (!e) return false;
  if (!supabaseConfigured()) {
    // Stub mode: allow access flow to be tested in development only.
    return process.env.NODE_ENV !== "production";
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pm_roles_access?select=email&email=eq.${encodeURIComponent(e)}`,
      {
        headers: {
          apikey: SERVICE_KEY!,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return false;
    const rows = (await res.json()) as unknown[];
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

/** Record a buyer as entitled (idempotent upsert on email). */
export async function grantEntitlement(
  email: string,
  stripeSessionId?: string,
  amountCents?: number,
): Promise<void> {
  const e = normalizeEmail(email);
  if (!e) return;
  if (!supabaseConfigured()) {
    console.log(`[pm-roles] (stub) granted access to ${e}`);
    return;
  }
  await fetch(
    `${SUPABASE_URL}/rest/v1/pm_roles_access?on_conflict=email`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY!,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        email: e,
        stripe_session_id: stripeSessionId,
        amount_cents: amountCents,
      }),
    },
  );
}

/** Email a fresh magic link. In stub mode it logs the link instead. */
export async function sendMagicLink(
  email: string,
  origin: string,
): Promise<{ link: string; sent: boolean }> {
  const e = normalizeEmail(email);
  const token = signPayload({ email: e, exp: Date.now() + MAGIC_LINK_TTL_MS });
  const link = `${origin}/pm-roles/unlock?token=${encodeURIComponent(token)}`;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(`[pm-roles] (stub) magic link for ${e}: ${link}`);
    return { link, sent: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.CONTACT_FROM || "PM Launch Lab <hello@pmlaunchlab.com>",
      to: [e],
      subject: "Your Live PM Roles access link",
      html: `<p>You're all set — here's a link to open the full Live PM Roles list anytime:</p>
<p><a href="${link}">Open Live PM Roles</a></p>
<p>Bookmark this email for future visits. The link expires in 1 hour; request a fresh one anytime from the site.</p>`,
    }),
  });
  return { link, sent: res.ok };
}

type StripeCheckoutSession = {
  id?: string;
  payment_status?: string;
  amount_total?: number;
  customer_email?: string;
  customer_details?: { email?: string };
  metadata?: Record<string, string>;
};

/**
 * Verify a completed Stripe Checkout session, record entitlement, and email a
 * backup access link. Safe to call from both the success redirect and webhook.
 */
export async function fulfillCheckoutSession(
  sessionId: string,
  origin: string,
): Promise<{ email: string } | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId) return null;

  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;

  const session = (await res.json()) as StripeCheckoutSession;
  if (session.payment_status !== "paid") return null;
  if (session.metadata?.product !== "pm-roles") return null;

  const email = session.customer_details?.email || session.customer_email;
  if (!email) return null;

  const normalized = normalizeEmail(email);
  await grantEntitlement(normalized, session.id, session.amount_total);
  await sendMagicLink(normalized, origin);

  return { email: normalized };
}

/** Set the long-lived access cookie on a NextResponse redirect. */
export function setAccessCookie(res: NextResponse, email: string): NextResponse {
  const cookie = makeAccessCookie(email);
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cookie.maxAge,
  });
  return res;
}

function makeAccessCookie(email: string): {
  name: string;
  value: string;
  maxAge: number;
} {
  const value = signPayload({
    email: normalizeEmail(email),
    exp: Date.now() + COOKIE_TTL_MS,
  });
  return { name: ACCESS_COOKIE, value, maxAge: Math.floor(COOKIE_TTL_MS / 1000) };
}

/** Validate a magic-link token; returns the email if valid. */
export function emailFromMagicToken(token?: string | null): string | null {
  return verifyPayload(token)?.email ?? null;
}

const ADMIN_APPROVE_TTL_MS = 1000 * 60 * 60 * 48; // 48 hours

function signAdminApproveToken(email: string): string {
  return signPayload({
    email: normalizeEmail(email),
    exp: Date.now() + ADMIN_APPROVE_TTL_MS,
    purpose: "admin_approve",
  });
}

function emailFromAdminApproveToken(token?: string | null): string | null {
  return verifyPayload(token, "admin_approve")?.email ?? null;
}

async function sendEmail(opts: {
  to: string[];
  subject: string;
  html: string;
}): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log(`[pm-roles] (stub email) to ${opts.to.join(", ")}: ${opts.subject}`);
    console.log(opts.html.replace(/<[^>]+>/g, " ").trim());
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.CONTACT_FROM || "PM Launch Lab <hello@pmlaunchlab.com>",
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  return res.ok;
}

/**
 * Buyer submitted Venmo payment — notify admin to approve and confirm to buyer.
 */
export async function requestVenmoAccess(
  email: string,
  origin: string,
  venmoUsername?: string,
): Promise<{ message: string }> {
  const e = normalizeEmail(email);
  if (!e) {
    return { message: "Please enter a valid email address." };
  }

  if (await isEntitled(e)) {
    await sendMagicLink(e, origin);
    return {
      message:
        "You already have access — we just sent a fresh link to your email.",
    };
  }

  const approveToken = signAdminApproveToken(e);
  const approveUrl = `${origin}/pm-roles/approve?token=${encodeURIComponent(approveToken)}`;
  const adminTo = process.env.CONTACT_TO || process.env.ADMIN_EMAIL;

  if (adminTo) {
    await sendEmail({
      to: [adminTo],
      subject: `Approve Live PM Roles access — ${e}`,
      html: `<p><strong>${e}</strong> says they paid via Venmo for Live PM Roles (${priceLabel()}).</p>
${venmoUsername ? `<p>Venmo username: <strong>${venmoUsername}</strong></p>` : ""}
<p>Check your Venmo app, then approve to send them access:</p>
<p><a href="${approveUrl}" style="display:inline-block;padding:12px 24px;background:#9b87f5;color:white;text-decoration:none;border-radius:999px;font-weight:bold;">Approve access</a></p>
<p style="color:#666;font-size:13px;">This link expires in 48 hours. Only click if you see the matching Venmo payment.</p>`,
    });
  } else {
    console.log(`[pm-roles] (stub) admin approve link for ${e}: ${approveUrl}`);
  }

  await sendEmail({
    to: [e],
    subject: "Live PM Roles — payment received, confirming shortly",
    html: `<p>Thanks for your Venmo payment!</p>
<p>I'm confirming it now and will email your access link within a few minutes (usually much faster).</p>
<p>No need to send proof of payment — we'll handle it from here.</p>`,
  });

  return {
    message:
      "Thanks! Check your email — your access link is on the way once payment is confirmed (usually within minutes).",
  };
}

/** Admin clicked approve — grant access and email buyer their magic link. */
export async function approveVenmoAccess(
  token: string,
  origin: string,
): Promise<{ email: string } | null> {
  const email = emailFromAdminApproveToken(token);
  if (!email) return null;

  await grantEntitlement(email, `venmo:${Date.now()}`, priceCents());
  await sendMagicLink(email, origin);
  return { email };
}

/** Server-side: the unlocked email from the access cookie, or null. */
export async function getUnlockedEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  return verifyPayload(token)?.email ?? null;
}
