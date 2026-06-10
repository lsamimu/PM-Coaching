import { NextResponse } from "next/server";
import { services } from "@/lib/data";

/**
 * Pay-then-book: creates a Stripe Checkout Session for a paid coaching service.
 * On successful payment, Stripe redirects the client to the booking page where
 * they schedule via Calendly. (Calendly stays free for the discovery call only.)
 *
 * Uses inline `price_data`, so it works as soon as STRIPE_SECRET_KEY is set —
 * no need to pre-create products/prices in the Stripe dashboard.
 *
 * STUB: with no key set, returns a friendly "payments not live yet" message.
 */
export async function POST(req: Request) {
  try {
    const { slug, email } = await req.json();
    const service = services.find((s) => s.slug === slug);

    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({
        url: null,
        message:
          "Payments aren't live yet — add a Stripe key to enable pay-then-book. (You can still reach out via Contact.)",
      });
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "usd");
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(service.amountCents),
    );
    params.set(
      "line_items[0][price_data][product_data][name]",
      `${service.title} — PM Launch Lab`,
    );
    params.set("success_url", `${origin}/coaching/booked?service=${service.slug}`);
    params.set("cancel_url", `${origin}/coaching`);
    params.set("metadata[slug]", service.slug);
    if (email) params.set("customer_email", String(email));

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
