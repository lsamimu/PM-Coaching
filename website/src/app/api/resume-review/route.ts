import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Resume Review intake — accepts the user's resume so Sammy can prep before the
 * booked session. Expects multipart/form-data: name, email, notes, resume(file).
 *
 * STUB: validates + logs. When RESEND_API_KEY is set, it emails the resume to
 * you as an attachment via Resend (https://resend.com).
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const resume = form.get("resume");

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json(
        { error: "Please attach your resume (PDF or Word)." },
        { status: 400 },
      );
    }
    if (resume.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Resume is too large (max 8 MB)." },
        { status: 400 },
      );
    }
    const isAllowedType =
      ALLOWED.includes(resume.type) || /\.(pdf|docx?|)$/i.test(resume.name);
    if (!isAllowedType) {
      return NextResponse.json(
        { error: "Please upload a PDF or Word document." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.CONTACT_FROM ||
            "PM Launch Lab <hello@pmlaunchlab.com>",
          to: [process.env.CONTACT_TO || site.email],
          reply_to: email,
          subject: `Resume Review request from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nNotes:\n${notes || "—"}\n\nResume attached: ${resume.name}`,
          attachments: [
            { filename: resume.name || "resume", content: buffer.toString("base64") },
          ],
        }),
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: "Couldn't send your resume right now. Please email it directly." },
          { status: 502 },
        );
      }
    } else {
      console.log(
        `[resume-review] (stub) ${name} <${email}> uploaded "${resume.name}" (${(resume.size / 1024).toFixed(0)} KB). Notes: ${notes || "—"}`,
      );
    }

    return NextResponse.json({
      message: "Got your resume! Now pick a time and I'll come prepared 💜",
      calendly: site.calendly,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
