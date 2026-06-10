import { NextResponse } from "next/server";
import { priceCents, priceLabel } from "@/lib/access";

/**
 * Creates a one-time Stripe Checkout session for lifetime access to the
 * Live PM Roles list. Accepts card or Venmo (US). Payment is verified by
 * Stripe before access is granted — see /pm-roles/success.
 *
 * Stub mode (no STRIPE_SECRET_KEY): returns a friendly "coming soon" message.
 */
export async function POST(req: Request) {
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({
      url: null,
      message: `Live PM Roles access (${priceLabel()}) is coming soon! Join the newsletter to be notified the moment it opens.`,
    });
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("payment_method_types[0]", "card");
  params.set("payment_method_types[1]", "venmo");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(priceCents()));
  params.set(
    "line_items[0][price_data][product_data][name]",
    "Live PM Roles — Lifetime Access",
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    "Unlimited access to the always-updating list of live PM roles.",
  );
  params.set("metadata[product]", "pm-roles");
  params.set("success_url", `${origin}/pm-roles/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/pm-roles?purchase=cancelled`);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Couldn't start checkout. Please try again." },
        { status: 502 },
      );
    }
    const session = await res.json();
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
