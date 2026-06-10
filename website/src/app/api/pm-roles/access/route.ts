import { NextResponse } from "next/server";
import { isEntitled, sendMagicLink } from "@/lib/access";

/**
 * "Already purchased? Get my access link" — re-sends a magic link to buyers.
 * Returns a generic message regardless, so it can't be used to probe which
 * emails have purchased.
 */
export async function POST(req: Request) {
  let email: string;
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  if (await isEntitled(email)) {
    await sendMagicLink(email, origin);
  }

  return NextResponse.json({
    message:
      "If that email has access, we've sent a fresh link. Check your inbox (and spam).",
  });
}
