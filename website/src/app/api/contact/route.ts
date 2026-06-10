import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Contact form handler.
 *
 * STUB: validates + logs. To go live, set RESEND_API_KEY in .env and this will
 * email the submission to you via Resend (https://resend.com).
 */
export async function POST(req: Request) {
  try {
    const { name, email, goal, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || "PM Launch Lab <hello@pmlaunchlab.com>",
          to: [process.env.CONTACT_TO || site.email],
          reply_to: email,
          subject: `New contact form message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nGoal: ${goal || "—"}\n\n${message}`,
        }),
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Could not send right now. Please email me directly." },
          { status: 502 },
        );
      }
    } else {
      console.log(
        `[contact] (stub) from ${name} <${email}> | goal: ${goal} | ${message}`,
      );
    }

    return NextResponse.json({
      message: "Thanks! I'll get back to you within 1–2 business days 💜",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
