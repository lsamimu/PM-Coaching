import { NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillCheckoutSession } from "@/lib/access";

/**
 * Stripe webhook. On a completed one-time purchase of "pm-roles", records the
 * buyer as entitled and emails them a magic access link.
 *
 * Requires STRIPE_WEBHOOK_SECRET to verify signatures. Without it (stub/dev),
 * the event is logged and ignored.
 */
export const dynamic = "force-dynamic";

function verifySignature(
  payload: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string]),
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${payload}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const payload = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.log("[stripe webhook] (stub) received event; no secret configured");
    return NextResponse.json({ received: true });
  }

  if (!verifySignature(payload, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: {
    type?: string;
    data?: { object?: Record<string, unknown> };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object ?? {};
    const metadata = (session.metadata ?? {}) as Record<string, string>;
    if (metadata.product === "pm-roles") {
      const sessionId = session.id as string | undefined;
      if (sessionId) {
        const origin =
          process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
        await fulfillCheckoutSession(sessionId, origin);
      }
    }
  }

  return NextResponse.json({ received: true });
}
