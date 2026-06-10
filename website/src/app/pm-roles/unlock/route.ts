import { NextResponse } from "next/server";
import { emailFromMagicToken, setAccessCookie } from "@/lib/access";

/**
 * Magic-link landing. Verifies the signed token, sets a long-lived access
 * cookie, and redirects to the unlocked list.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const email = emailFromMagicToken(token);

  if (!email) {
    return NextResponse.redirect(new URL("/pm-roles?unlock=invalid", url));
  }

  const res = NextResponse.redirect(new URL("/pm-roles?welcome=1", url));
  return setAccessCookie(res, email);
}
