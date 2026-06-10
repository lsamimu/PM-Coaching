import { NextResponse } from "next/server";
import { approveVenmoAccess } from "@/lib/access";

/**
 * Admin one-click approve after confirming Venmo payment. Grants entitlement
 * and emails the buyer their access link.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/pm-roles?approve=invalid", url));
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
  const result = await approveVenmoAccess(token, origin);

  if (!result) {
    return NextResponse.redirect(new URL("/pm-roles?approve=invalid", url));
  }

  return NextResponse.redirect(
    new URL(`/pm-roles?approve=done&email=${encodeURIComponent(result.email)}`, url),
  );
}
