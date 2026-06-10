import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Newsletter signup — "The PM Launch Letter".
 *
 * Priority: ConvertKit → Beehiiv → Resend fallback (notify admin + welcome email).
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const normalized = email.trim().toLowerCase();

    const convertKitKey = process.env.CONVERTKIT_API_KEY;
    const convertKitForm = process.env.CONVERTKIT_FORM_ID;
    const beehiivKey = process.env.BEEHIIV_API_KEY;
    const beehiivPub = process.env.BEEHIIV_PUBLICATION_ID;

    if (convertKitKey && convertKitForm) {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${convertKitForm}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: convertKitKey, email: normalized }),
        },
      );
      if (!res.ok) {
        return NextResponse.json(
          { error: "Subscription service error. Please try again." },
          { status: 502 },
        );
      }
    } else if (beehiivKey && beehiivPub) {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${beehiivPub}/subscriptions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${beehiivKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: normalized, reactivate_existing: true }),
        },
      );
      if (!res.ok) {
        return NextResponse.json(
          { error: "Subscription service error. Please try again." },
          { status: 502 },
        );
      }
    } else if (process.env.RESEND_API_KEY) {
      const from =
        process.env.CONTACT_FROM || "PM Launch Lab <hello@pmlaunchlab.com>";
      const adminTo = process.env.CONTACT_TO || site.email;
      const resendKey = process.env.RESEND_API_KEY;

      const [adminRes, welcomeRes] = await Promise.all([
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [adminTo],
            subject: `New newsletter subscriber — ${normalized}`,
            text: `New PM Launch Letter subscriber: ${normalized}`,
          }),
        }),
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [normalized],
            subject: "You're on the list — The PM Launch Letter 💜",
            html: `<p>Thanks for subscribing to <strong>The PM Launch Letter</strong>!</p>
<p>You'll hear from ${site.founder} with PM career tips, frameworks, and launch guidance.</p>
<p>— ${site.name}</p>`,
          }),
        }),
      ]);

      if (!adminRes.ok || !welcomeRes.ok) {
        return NextResponse.json(
          { error: "Could not subscribe right now. Please try again." },
          { status: 502 },
        );
      }
    } else {
      console.log(`[newsletter] (stub) new subscriber: ${normalized}`);
    }

    return NextResponse.json({
      message: "You're in! Watch your inbox for The PM Launch Letter 💜",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
