import { NextResponse } from "next/server";
import { fulfillCheckoutSession, setAccessCookie } from "@/lib/access";

/**
 * Stripe Checkout success landing. Verifies payment server-side, grants access
 * immediately (cookie), records entitlement, and emails a backup link — no
 * manual proof or waiting required.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/pm-roles?purchase=invalid", url));
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const result = await fulfillCheckoutSession(sessionId, origin);

  if (!result) {
    return NextResponse.redirect(new URL("/pm-roles?purchase=pending", url));
  }

  const res = NextResponse.redirect(new URL("/pm-roles?welcome=1", url));
  return setAccessCookie(res, result.email);
}
