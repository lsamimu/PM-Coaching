import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Customer feedback / ratings intake.
 *
 * IMPORTANT: feedback is captured PRIVATELY — it is never shown on the public
 * site automatically. Sammy reviews it (in the future admin dashboard) and only
 * then promotes selected reviews to `testimonials` in src/lib/data.ts.
 *
 * STUB: validates + logs. Wire up later by either:
 *   - Supabase: insert into a `feedback` table (recommended for the dashboard), or
 *   - Resend: email each submission to Sammy (set RESEND_API_KEY).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rating = Number(body.rating);
    const name = String(body.name || "").trim();
    const message = String(body.message || "").trim();
    const email = String(body.email || "").trim();
    const service = String(body.service || "").trim();
    const consent = Boolean(body.consent);

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please pick a star rating (1–5)." },
        { status: 400 },
      );
    }
    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and feedback are required." },
        { status: 400 },
      );
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const record = {
      rating,
      name,
      email: email || null,
      service: service || null,
      message,
      canFeature: consent,
      submittedAt: new Date().toISOString(),
    };

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.CONTACT_FROM || "PM Launch Lab <hello@pmlaunchlab.com>",
          to: [process.env.CONTACT_TO || site.email],
          reply_to: email || undefined,
          subject: `New feedback: ${rating}★ from ${name}`,
          text: `Rating: ${rating}/5\nName: ${name}\nEmail: ${email || "—"}\nService: ${service || "—"}\nCan feature publicly: ${consent ? "Yes" : "No"}\n\n${message}`,
        }),
      });
    } else {
      // No provider yet — log so it's visible in dev / server logs.
      console.log("[feedback] (stub) new submission:", record);
    }

    return NextResponse.json({
      message:
        "Your feedback was sent to Sammy. Thank you for helping PM Launch Lab grow!",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
