import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

/**
 * Stripe Checkout session creator for premium digital products.
 * Uses inline price_data — set STRIPE_SECRET_KEY to go live.
 */
export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    const product = getProduct(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json({
        url: null,
        message: `"${product.title}" checkout is coming soon! Join the newsletter or contact ${process.env.CONTACT_TO || "us"} to get early access.`,
      });
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "usd");
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(product.amountCents),
    );
    params.set(
      "line_items[0][price_data][product_data][name]",
      product.title,
    );
    params.set(
      "line_items[0][price_data][product_data][description]",
      product.tagline,
    );
    params.set("success_url", `${origin}/resources/${product.slug}?success=1`);
    params.set("cancel_url", `${origin}/resources/${product.slug}`);
    params.set("metadata[slug]", product.slug);

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
