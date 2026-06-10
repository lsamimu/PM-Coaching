/**
 * Central site configuration & editable content.
 * Swap placeholder copy / metrics / links here without touching components.
 */

export const site = {
  name: "PM Launch Lab",
  founder: "Sammy Lydia",
  tagline:
    "Helping aspiring Product Managers break into PM careers through coaching, resources, and AI-era career guidance.",
  mission:
    "Make Product Management more accessible for students, career switchers, and aspiring PMs.",
  url: "https://pmlaunchlab.com",
  email: "sammy.lydia26@gmail.com",
  // Update these links when the real accounts exist.
  social: {
    linkedin: "https://www.linkedin.com/in/sammylydia",
    twitter: "https://twitter.com/pmlaunchlab",
    youtube: "https://youtube.com/@pmlaunchlab",
  },
  // Booking link (Calendly).
  calendly: "https://calendly.com/chatwithlydia",
  /** Venmo username for Live PM Roles (no @). Set VENMO_HANDLE in .env.local */
  venmoHandle:
    process.env.NEXT_PUBLIC_VENMO_HANDLE ||
    process.env.VENMO_HANDLE ||
    "",
} as const;

/** Build a Venmo pay link with amount + note pre-filled. */
export function venmoPayUrl(note: string): string | null {
  const handle = site.venmoHandle.replace(/^@/, "");
  if (!handle) return null;
  const amount = (
    Number(process.env.PM_ROLES_PRICE_CENTS || 1900) / 100
  ).toFixed(0);
  const params = new URLSearchParams({
    txn: "pay",
    audience: "private",
    amount,
    note,
    recipients: handle,
  });
  return `https://venmo.com/?${params.toString()}`;
}

export function venmoDisplayHandle(): string | null {
  if (!site.venmoHandle) return null;
  return `@${site.venmoHandle.replace(/^@/, "")}`;
}

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Coaching", href: "/coaching" },
  { label: "PM Roles", href: "/pm-roles" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Homepage credibility metrics — easily editable.
 * Empty for now (no fabricated stats). Add REAL numbers here when you have them
 * and they'll automatically render on the homepage.
 */
export const metrics: { label: string; value: number; suffix?: string }[] = [];

export const credibility = [
  "Product Manager",
  "Microsoft",
  "PM Mentor",
  "Career Coach",
] as const;
