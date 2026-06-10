import { NextResponse } from "next/server";
import { requestVenmoAccess } from "@/lib/access";

/**
 * Buyer says they've paid via Venmo. Emails admin an approve link and
 * confirms to the buyer — no proof-of-payment upload required.
 */
export async function POST(req: Request) {
  let email: string;
  let venmoUsername: string | undefined;
  try {
    ({ email, venmoUsername } = await req.json());
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

  const result = await requestVenmoAccess(email, origin, venmoUsername?.trim());
  return NextResponse.json(result);
}
