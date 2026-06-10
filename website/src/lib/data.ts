/**
 * Editable content collections (placeholder copy for now).
 * Replace text, pricing, and links with real content when ready.
 */

export type Service = {
  slug: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  outcomes: string[];
  price: string;
  /** Shown next to the price, e.g. "per session". */
  priceUnit?: string;
  /** Price in cents, used for Stripe Checkout. */
  amountCents: number;
  cta: string;
  popular?: boolean;
  /** Optional highlighted bonus included with this service. */
  bonus?: string;
  /** Optional custom CTA destination. Internal paths start with "/", external links start with "http". Defaults to the pay-then-book flow. */
  ctaHref?: string;
};

export const services: Service[] = [
  {
    slug: "resume-review",
    title: "Resume Review",
    emoji: "📄",
    tagline: "Get past the screen",
    description:
      "Line-by-line review of your resume with PM-specific framing so recruiters instantly see your product impact.",
    outcomes: [
      "Recruiter-ready, ATS-friendly resume",
      "Quantified, PM-flavored bullet points",
      "Before/after annotated edits",
    ],
    price: "$100",
    amountCents: 10000,
    cta: "Send resume & pay",
    ctaHref: "/coaching/resume-review",
    popular: true,
    bonus: "Free LinkedIn profile optimization included",
  },
  {
    slug: "career-clarity",
    title: "Career Clarity Session",
    emoji: "🧭",
    tagline: "Figure out your PM path",
    description:
      "A focused 1:1 to map where you are, where you want to go, and the fastest realistic route into Product Management.",
    outcomes: [
      "A personalized 90-day PM roadmap",
      "Clarity on which PM roles fit you",
      "An action list you can start today",
    ],
    price: "$120",
    priceUnit: "per session",
    amountCents: 12000,
    cta: "Pay & book",
  },
  {
    slug: "interview-prep",
    title: "Interview Prep",
    emoji: "🎤",
    tagline: "Walk in confident",
    description:
      "A realistic mock interview covering product sense, analytics, or behavioral rounds, with detailed, honest feedback. Priced per mock interview session.",
    outcomes: [
      "One live mock interview + recording",
      "Frameworks for product & metrics questions",
      "A scorecard with concrete next steps",
    ],
    price: "$100",
    priceUnit: "per session",
    amountCents: 10000,
    cta: "Pay & book a session",
  },
];

/** Services preview shown on the homepage (subset). */
export const homeServices = [
  services.find((s) => s.slug === "resume-review"),
  services.find((s) => s.slug === "career-clarity"),
  services.find((s) => s.slug === "interview-prep"),
].filter((s): s is Service => s != null);

export type Testimonial = {
  name: string;
  role: string;
  photo?: string;
  quote: string;
  linkedin?: string;
  outcome?: string;
};

/**
 * Approved testimonials shown publicly.
 * Empty for now — real reviews are collected via the feedback form and only
 * appear here after Sammy approves them (e.g. from the future dashboard).
 */
export const testimonials: Testimonial[] = [];

export type Product = {
  slug: string;
  title: string;
  category: "Job Search" | "Networking" | "Interview Prep" | "Career Playbook";
  emoji: string;
  description: string;
  price: string;
  amountCents: number;
  badge?: string;
  tagline?: string;
  owns?: string;
  notionBundleUrl: string;
};

/** Premium digital products — see src/lib/products.ts for full specs. */
export { products, premiumProducts, getProduct, getFlagshipProduct, osProducts } from "@/lib/products";
export type { PremiumProduct } from "@/lib/products";
export {
  getNotionLinks,
  getNotionBundleUrl,
  getNotionWorkspaceUrl,
  getNotionPageUrl,
  getNotionDatabaseUrl,
  getNotionTemplateUrl,
  NOTION_MASTER_HUB_URL,
} from "@/lib/notion-links";

export type Post = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readingTime: string;
  emoji: string;
};

export const postCategories = [
  "Breaking Into PM",
  "Internships",
  "AI for PMs",
  "Resume Tips",
  "Interview Prep",
  "Microsoft Learnings",
] as const;

export const posts: Post[] = [
  {
    slug: "break-into-pm-without-experience",
    title: "How to Break Into PM Without PM Experience",
    category: "Breaking Into PM",
    excerpt:
      "The exact framework I used to position non-PM experience as product impact — and land interviews.",
    date: "2026-05-12",
    readingTime: "7 min",
    emoji: "🚀",
  },
  {
    slug: "ai-tools-every-pm-should-use",
    title: "5 AI Tools Every Aspiring PM Should Use in 2026",
    category: "AI for PMs",
    excerpt:
      "AI won't replace PMs, but PMs who use AI will replace those who don't. Here's where to start.",
    date: "2026-05-04",
    readingTime: "6 min",
    emoji: "🤖",
  },
  {
    slug: "pm-resume-mistakes",
    title: "7 PM Resume Mistakes That Get You Auto-Rejected",
    category: "Resume Tips",
    excerpt:
      "Recruiters spend 6 seconds on your resume. Avoid these mistakes to make every second count.",
    date: "2026-04-22",
    readingTime: "5 min",
    emoji: "📄",
  },
  {
    slug: "product-sense-framework",
    title: "A Simple Framework for Product Sense Interviews",
    category: "Interview Prep",
    excerpt:
      "Stop freezing on 'design a product for X' questions. Use this repeatable structure.",
    date: "2026-04-10",
    readingTime: "8 min",
    emoji: "🎤",
  },
  {
    slug: "lessons-from-microsoft",
    title: "What Microsoft Taught Me About Being a Great PM",
    category: "Microsoft Learnings",
    excerpt:
      "Three lessons from shipping products at scale that no PM course will teach you.",
    date: "2026-03-28",
    readingTime: "6 min",
    emoji: "🪟",
  },
  {
    slug: "land-a-pm-internship-as-a-student",
    title: "How to Land a PM Internship as a College Student",
    category: "Internships",
    excerpt:
      "No experience yet? Here's how students stand out and land their first Product Management internship.",
    date: "2026-03-15",
    readingTime: "7 min",
    emoji: "🎓",
  },
];

export type TimelineItem = {
  year: string;
  title: string;
  body: string;
  emoji: string;
};

export const aboutTimeline: TimelineItem[] = [
  {
    year: "The Spark",
    title: "My Journey",
    body: "I didn't start with a 'product' title. Like many of you, I was curious, scrappy, and unsure if PM was even possible for me.",
    emoji: "✨",
  },
  {
    year: "The Leap",
    title: "Breaking into PM",
    body: "Through relentless learning, networking, and a lot of failed applications, I broke into Product Management — and eventually Microsoft.",
    emoji: "🪟",
  },
  {
    year: "The Lessons",
    title: "Lessons Learned",
    body: "Shipping at scale taught me what actually matters: customer obsession, crisp communication, and shipping value over being right.",
    emoji: "📚",
  },
  {
    year: "Today",
    title: "Why I Started PM Launch Lab",
    body: "I started PM Launch Lab to make the path I wish I'd had — accessible, warm, and practical — for the next wave of aspiring PMs.",
    emoji: "🚀",
  },
];
