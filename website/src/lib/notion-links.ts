/**
 * Maps PM Launch Lab products → exact Notion pages in the master template workspace.
 * Update URLs here when pages move; optional env overrides for customer duplicate links.
 */

export type NotionProductLinks = {
  bundleUrl: string;
  /** Shown in UI — e.g. "Open Playbook Home" */
  entryLabel: string;
  entryUrl: string;
  sections: Record<string, string>;
  pages: Record<string, string>;
  databases: Record<string, string>;
  /** products.ts template label → Notion page */
  templates: Record<string, string>;
  /** products.ts name → canonical Notion page title key in `pages` */
  aliases?: Record<string, string>;
};

export const NOTION_MASTER_HUB_URL =
  "https://app.notion.com/p/37a09d9fee5881978637d78952356bc9";

const notionLinksBySlug: Record<string, NotionProductLinks> = {
  "non-technical-to-pm": {
    bundleUrl:
      "https://app.notion.com/p/37a09d9fee5881ce8158e41903a2ee4f",
    entryLabel: "Open Playbook Home",
    entryUrl: "https://app.notion.com/p/37a09d9fee5881e1bc5be42b40db46ac",
    sections: {
      "📊 Dashboard":
        "https://app.notion.com/p/37a09d9fee58819fba7bcab9a2857503",
      "📚 Resources":
        "https://app.notion.com/p/37a09d9fee58816cb3d0cf8f8778ad0c",
      "📈 Progress Tracking":
        "https://app.notion.com/p/37a09d9fee5881d7be64cf84c7a339a7",
      "🏠 Start Here":
        "https://app.notion.com/p/37a09d9fee5881beb74edaeeffdb1260",
      "🔍 Know Your Gap":
        "https://app.notion.com/p/37a09d9fee5881438eb5e320be7e6042",
      "📄 Build Your Story":
        "https://app.notion.com/p/37a09d9fee5881e6aa03c40b06f69926",
      "📚 Learn PM":
        "https://app.notion.com/p/37a09d9fee5881f8831afb61e63bd231",
      "⚙️ Technical for PMs":
        "https://app.notion.com/p/37a09d9fee58817582aafb9a939bb24b",
      "📅 Execute Your Plan":
        "https://app.notion.com/p/37a09d9fee58819b9240c84b9a1dcfa5",
      "🗺️ What's Next":
        "https://app.notion.com/p/37a09d9fee58811c86c8c6ba389f1ab2",
    },
    pages: {
      "Playbook Home":
        "https://app.notion.com/p/37a09d9fee5881e1bc5be42b40db46ac",
      "How to Use This Playbook":
        "https://app.notion.com/p/37a09d9fee5881478f1cf34026c60b9b",
      "Sammy's Journey (Non-Technical → Microsoft PM)":
        "https://app.notion.com/p/37a09d9fee588121bf3ace66ccac5275",
      "Which OS to Add & When":
        "https://app.notion.com/p/37a09d9fee5881ad8833c3d046ca24a0",
      "Skill Gap Analysis":
        "https://app.notion.com/p/37a09d9fee5881a8b269de7944c1835d",
      "Self-Assessment Quiz":
        "https://app.notion.com/p/37a09d9fee5881c3b6cee871f106a007",
      "Gap Score Dashboard":
        "https://app.notion.com/p/37a09d9fee58812bb771e1a59f5b310c",
      "Priority Skills to Build":
        "https://app.notion.com/p/37a09d9fee5881f0822ac4760ade6696",
      "Resume Transformation Guide":
        "https://app.notion.com/p/37a09d9fee5881898945ecf1bf837bad",
      "PM Bullet Formula Library":
        "https://app.notion.com/p/37a09d9fee58814facf9ef2c17af6f1e",
      "Before/After Examples":
        "https://app.notion.com/p/37a09d9fee588186b73bcdfaca2d2b9a",
      "LinkedIn Profile Checklist":
        "https://app.notion.com/p/37a09d9fee5881b68459f4baf04af0dc",
      "What PMs Actually Do":
        "https://app.notion.com/p/37a09d9fee58815cb66dd28a13b7758c",
      "Discovery & Prioritization":
        "https://app.notion.com/p/37a09d9fee5881a6beccc166e68c1655",
      "Metrics & Roadmaps":
        "https://app.notion.com/p/37a09d9fee58812687e9ef0b792a498a",
      "Stakeholder Communication":
        "https://app.notion.com/p/37a09d9fee5881ef9e36fa7b9abd56be",
      "APIs & Integrations (PM-level)":
        "https://app.notion.com/p/37a09d9fee58816e9d06d8e2e66497ce",
      "Data & Analytics Basics":
        "https://app.notion.com/p/37a09d9fee5881569e1df0a5f04f897c",
      "System Design (what PMs need to know)":
        "https://app.notion.com/p/37a09d9fee5881168e17c868b16edc8c",
      "Technical Trade-off Framework":
        "https://app.notion.com/p/37a09d9fee588118bad4f1d4679a33b5",
      "90-Day Learning Plan":
        "https://app.notion.com/p/37a09d9fee58814c9702cc5bea1e5e9e",
      "Weekly Accountability Tracker":
        "https://app.notion.com/p/37a09d9fee58813ea582ea1feadf2c94",
      "Learning Log":
        "https://app.notion.com/p/37a09d9fee58811d875dd551f6734399",
      "Progress Dashboard":
        "https://app.notion.com/p/37a09d9fee58813897d2fbf9c05b1413",
      "Networking Strategy Overview (then use Networking OS)":
        "https://app.notion.com/p/37a09d9fee58819cb5d0ea75d26b5a86",
      "Interview Readiness Overview (then use Interview Prep OS)":
        "https://app.notion.com/p/37a09d9fee5881daacb1c9039f8cd899",
      "Job Search Strategy Overview (then use Command Center)":
        "https://app.notion.com/p/37a09d9fee5881748597d4b2595768a4",
      "Networking Strategy Overview":
        "https://app.notion.com/p/37a09d9fee58819cb5d0ea75d26b5a86",
      "Interview Readiness Overview":
        "https://app.notion.com/p/37a09d9fee5881daacb1c9039f8cd899",
      "Job Search Strategy Overview":
        "https://app.notion.com/p/37a09d9fee5881748597d4b2595768a4",
      "👋 Welcome":
        "https://app.notion.com/p/37a09d9fee58812da777fd260dff08cf",
      "⚡ Quick Start Guide":
        "https://app.notion.com/p/37a09d9fee5881f3b421f65af406005e",
    },
    databases: {
      "Skill Gap Tracker":
        "https://app.notion.com/p/76c3bf53057b4261b81b91473e5ba334",
      "90-Day Plan":
        "https://app.notion.com/p/d415534af1174b0494f5e8ef9f1891f8",
      "Weekly Accountability":
        "https://app.notion.com/p/97fb1c42d3f04c90ae3b5215604e4050",
      "Learning Log":
        "https://app.notion.com/p/e15e9d495ef841a88219ca55d956ba8c",
    },
    templates: {},
  },

  "pm-job-search-command-center": {
    bundleUrl:
      "https://app.notion.com/p/37a09d9fee58813ebdf4e7320edad72e",
    entryLabel: "Open Pipeline Dashboard",
    entryUrl: "https://app.notion.com/p/37a09d9fee5881b59378fbc9b6836388",
    sections: {
      "📊 Dashboard":
        "https://app.notion.com/p/37a09d9fee5881e884fafa89474fbba1",
      "📚 Resources":
        "https://app.notion.com/p/37a09d9fee58814a99abd034e2af97ec",
      "📈 Progress Tracking":
        "https://app.notion.com/p/37a09d9fee5881bea3a2dd0f007cec41",
      "🏠 Home": "https://app.notion.com/p/37a09d9fee5881f2a9bf-e3dbc12491c9",
      "📊 Applications":
        "https://app.notion.com/p/37a09d9fee5881ed9260df7b81f0ac72",
      "📞 Recruiters":
        "https://app.notion.com/p/37a09d9fee588196bf05e9c20998c2a2",
      "📈 Analytics":
        "https://app.notion.com/p/37a09d9fee58812c955ef9f48ea380ee",
      "📝 Templates":
        "https://app.notion.com/p/37a09d9fee588130ae36f84dea3e94bf",
    },
    pages: {
      "Pipeline Dashboard":
        "https://app.notion.com/p/37a09d9fee5881b59378fbc9b6836388",
      "Quick Start":
        "https://app.notion.com/p/37a09d9fee588180a509e6da0fb20614",
      "Weekly Review":
        "https://app.notion.com/p/37a09d9fee5881be9cfad1ed832a54a1",
      "All Applications":
        "https://app.notion.com/p/37a09d9fee58815b8d0ef2196b2b3ce1",
      "Active Pipeline":
        "https://app.notion.com/p/37a09d9fee58811995fffd992d49356f",
      "Interview Stage":
        "https://app.notion.com/p/37a09d9fee5881dc9989d72f89779276",
      "Offers & Decisions":
        "https://app.notion.com/p/37a09d9fee5881d1a4cee05425b58371",
      Closed: "https://app.notion.com/p/37a09d9fee58811481befc1c9d9df247",
      "Monthly Metrics":
        "https://app.notion.com/p/37a09d9fee588108a49ec354cb149354",
      "Conversion Funnel":
        "https://app.notion.com/p/37a09d9fee5881e18feae8224231dbdf",
      "Source Performance":
        "https://app.notion.com/p/37a09d9fee5881fca6c3fe3a3393050f",
      "Post-Application Follow-Up (3-day)":
        "https://app.notion.com/p/37a09d9fee58812c9725e7376c20195d",
      "Post-Interview Thank-You":
        "https://app.notion.com/p/37a09d9fee5881c0b3a6e30188d635d4",
      "Status Check-In (2 weeks)":
        "https://app.notion.com/p/37a09d9fee5881d38649d557e1265733",
      "Offer Negotiation Opener":
        "https://app.notion.com/p/37a09d9fee588165a860f0f0873d257f",
      "Recruiter Intro Response":
        "https://app.notion.com/p/37a09d9fee58819b946ec12340ea3338",
      "👋 Welcome":
        "https://app.notion.com/p/37a09d9fee58810ebe7fdfb5da62b0d4",
      "⚡ Quick Start Guide":
        "https://app.notion.com/p/37a09d9fee58814181f4c6fef9b47b24",
    },
    databases: {
      Applications:
        "https://app.notion.com/p/d5345e28b0474396b70ca77b4f9ac1ed",
      "Recruiter Tracker":
        "https://app.notion.com/p/5470e50af940497f89ea53e0d46ee516",
    },
    templates: {
      "Post-application follow-up (3-day)":
        "https://app.notion.com/p/37a09d9fee58812c9725e7376c20195d",
      "Post-interview thank-you":
        "https://app.notion.com/p/37a09d9fee5881c0b3a6e30188d635d4",
      "Recruiter intro response":
        "https://app.notion.com/p/37a09d9fee58819b946ec12340ea3338",
      "Status check-in after 2 weeks":
        "https://app.notion.com/p/37a09d9fee5881d38649d557e1265733",
      "Offer negotiation opener":
        "https://app.notion.com/p/37a09d9fee588165a860f0f0873d257f",
    },
    aliases: {
      "Post-Application Follow-Up": "Post-Application Follow-Up (3-day)",
      "Status Check-In": "Status Check-In (2 weeks)",
      "Recruiter Tracker": "Recruiter Tracker",
      "Needs Follow-Up": "Recruiter Tracker",
    },
  },

  "pm-networking-os": {
    bundleUrl:
      "https://app.notion.com/p/37a09d9fee58814e95f9c01bc68e5506",
    entryLabel: "Open Networking Dashboard",
    entryUrl: "https://app.notion.com/p/37a09d9fee5881089dd8dc9a23132d4b",
    sections: {
      "📊 Dashboard":
        "https://app.notion.com/p/37a09d9fee58811cb0f0c777077fb01d",
      "📚 Resources":
        "https://app.notion.com/p/37a09d9fee58813f820ad6d41095c110",
      "📈 Progress Tracking":
        "https://app.notion.com/p/37a09d9fee588159b6c6ea3ff79c64a4",
      "🏠 Home": "https://app.notion.com/p/37a09d9fee58813081d8e2af2aa9e39e",
      "👥 Relationships":
        "https://app.notion.com/p/37a09d9fee58819aa0bffb648d85a622",
      "☕ Conversations":
        "https://app.notion.com/p/37a09d9fee5881e3898af7b587c5137d",
      "🔗 Referrals":
        "https://app.notion.com/p/37a09d9fee588180abbad8f3a84a9b77",
      "✉️ Outreach":
        "https://app.notion.com/p/37a09d9fee5881cd9303c68c4f4b05c5",
      "📊 Scorecard":
        "https://app.notion.com/p/37a09d9fee5881fca3b0f77cf85f5578",
    },
    pages: {
      "Networking Dashboard":
        "https://app.notion.com/p/37a09d9fee5881089dd8dc9a23132d4b",
      "This Week's Focus":
        "https://app.notion.com/p/37a09d9fee588143aeddd06b619a3ebd",
      "User Guide":
        "https://app.notion.com/p/37a09d9fee588118a679f66ef1efeebf",
      "Cold LinkedIn — PM at Target Company":
        "https://app.notion.com/p/37a09d9fee58818a8a64f5cc20b31de8",
      "Alumni Outreach — Same University":
        "https://app.notion.com/p/37a09d9fee5881658a1dd58f7ad5c683",
      "Referral Request — After Building Rapport":
        "https://app.notion.com/p/37a09d9fee5881f89876e10df0be8db8",
      "Follow-Up After No Response (7 days)":
        "https://app.notion.com/p/37a09d9fee58813da721d0af88759d83",
      "Informational Interview Request":
        "https://app.notion.com/p/37a09d9fee588129b35de9e64e8738ff",
      "Post-Coffee-Chat Thank-You":
        "https://app.notion.com/p/37a09d9fee58812db35ef04c550bc5a6",
      "Referral Request — Direct Ask":
        "https://app.notion.com/p/37a09d9fee588134a45af326cac20895",
      "Follow-Up After No Response (14 days)":
        "https://app.notion.com/p/37a09d9fee588195a8c4f330d22bb492",
      "Re-engagement — Dormant Contact":
        "https://app.notion.com/p/37a09d9fee588174bef5e83ffdd1bb79",
      "Event Follow-Up — Met at Meetup":
        "https://app.notion.com/p/37a09d9fee588103bb07d595c085474d",
      "Weekly Metrics":
        "https://app.notion.com/p/37a09d9fee5881fca3b0f77cf85f5578",
      "Message Library":
        "https://app.notion.com/p/37a09d9fee5881cd9303c68c4f4b05c5",
      "👋 Welcome":
        "https://app.notion.com/p/37a09d9fee5881ed8fc1f4e2f3b23964",
      "⚡ Quick Start Guide":
        "https://app.notion.com/p/37a09d9fee588140a7ded0b6d6dc8584",
    },
    databases: {
      "Relationship CRM":
        "https://app.notion.com/p/acd3da8843434db0bc7340cc197c0970",
      "Coffee Chats":
        "https://app.notion.com/p/f80a1920c7c346828a13352a2b1e5f2c",
      "Referral Tracker":
        "https://app.notion.com/p/d7d318f34a6c4cd080bd9be87c21c9c9",
      "Outreach Log":
        "https://app.notion.com/p/12f17169eebc4cf489d166573cf926ba",
    },
    templates: {
      "Cold LinkedIn outreach — PM at target company":
        "https://app.notion.com/p/37a09d9fee58818a8a64f5cc20b31de8",
      "Alumni outreach — same university":
        "https://app.notion.com/p/37a09d9fee5881658a1dd58f7ad5c683",
      "Informational interview request":
        "https://app.notion.com/p/37a09d9fee588129b35de9e64e8738ff",
      "Post-coffee-chat thank-you":
        "https://app.notion.com/p/37a09d9fee58812db35ef04c550bc5a6",
      "Referral request — after building rapport":
        "https://app.notion.com/p/37a09d9fee5881f89876e10df0be8db8",
      "Referral request — direct ask":
        "https://app.notion.com/p/37a09d9fee588134a45af326cac20895",
      "Follow-up after no response (7 days)":
        "https://app.notion.com/p/37a09d9fee58813da721d0af88759d83",
      "Follow-up after no response (14 days)":
        "https://app.notion.com/p/37a09d9fee588195a8c4f330d22bb492",
      "Re-engagement — dormant contact":
        "https://app.notion.com/p/37a09d9fee588174bef5e83ffdd1bb79",
      "Event follow-up — met at meetup":
        "https://app.notion.com/p/37a09d9fee588103bb07d595c085474d",
    },
    aliases: {
      "Coffee Chat Tracker": "Coffee Chats",
      "Upcoming Chats": "Coffee Chats",
      "Post-Chat Follow-Ups": "Post-Coffee-Chat Thank-You",
      "Referral Pipeline": "Referral Tracker",
      "Referrals Earned": "Referral Tracker",
      "Referrals Requested": "Referral Tracker",
      "Message Library": "Message Library",
      "Cold Outreach": "Cold LinkedIn — PM at Target Company",
      "Alumni Outreach": "Alumni Outreach — Same University",
      "LinkedIn Templates": "Cold LinkedIn — PM at Target Company",
      "Thank-You Messages": "Post-Coffee-Chat Thank-You",
      "Monthly Trends": "Weekly Metrics",
      "Conversion Rates": "Weekly Metrics",
    },
  },

  "pm-interview-prep-os": {
    bundleUrl:
      "https://app.notion.com/p/37a09d9fee58817e9828c546fee6a7f8",
    entryLabel: "Open Interview Dashboard",
    entryUrl: "https://app.notion.com/p/37a09d9fee5881409bf2df78351c0553",
    sections: {
      "📊 Dashboard":
        "https://app.notion.com/p/37a09d9fee58811ca2f2f26819f5926d",
      "📚 Resources":
        "https://app.notion.com/p/37a09d9fee588153ac05d60c857f406d",
      "📈 Progress Tracking":
        "https://app.notion.com/p/37a09d9fee5881308ffac02941037a26",
      "🏠 Home": "https://app.notion.com/p/37a09d9fee5881c68df2cd8df673d2cc",
      "📚 Question Bank":
        "https://app.notion.com/p/37a09d9fee5881f5bc9ce1330f581612",
      "🧠 Frameworks":
        "https://app.notion.com/p/37a09d9fee5881e3a510fb9301325a26",
      "🏋️ Practice":
        "https://app.notion.com/p/37a09d9fee58812ea0ebd4bb013f2331",
      "📊 Progress":
        "https://app.notion.com/p/37a09d9fee58812cbb5af83374963887",
    },
    pages: {
      "Interview Dashboard":
        "https://app.notion.com/p/37a09d9fee5881409bf2df78351c0553",
      "Readiness Assessment":
        "https://app.notion.com/p/37a09d9fee588110b16cc7e3f0cf6e7c",
      "This Week's Practice Plan":
        "https://app.notion.com/p/37a09d9fee588110a75cd790ecdb8884",
      "All Questions":
        "https://app.notion.com/p/37a09d9fee588175a847c5a53fd5339a",
      "Product Sense":
        "https://app.notion.com/p/37a09d9fee58816bbcadd17c9fad1112",
      "Product Design":
        "https://app.notion.com/p/37a09d9fee5881838a22e5914d7c6fd7",
      "Metrics & Analytics":
        "https://app.notion.com/p/37a09d9fee5881fa9f03ee9488104248",
      Execution:
        "https://app.notion.com/p/37a09d9fee588135a8e5c05ace07873b",
      Strategy:
        "https://app.notion.com/p/37a09d9fee588108b0a8c062cd68ccdc",
      Behavioral:
        "https://app.notion.com/p/37a09d9fee5881c8919bd71019d6ab16",
      Leadership:
        "https://app.notion.com/p/37a09d9fee5881098c4ec1241efa7e62",
      "CIRCLES Method":
        "https://app.notion.com/p/37a09d9fee5881c3ba16d026f73d64ca",
      "STAR for Behavioral":
        "https://app.notion.com/p/37a09d9fee58812bb24ef98bc647c5d2",
      "Metrics Framework":
        "https://app.notion.com/p/37a09d9fee58819f94b3d4bc074ae4bb",
      "Prioritization (RICE)":
        "https://app.notion.com/p/37a09d9fee5881768665d1e9a4e3f28e",
      "Prioritization (RICE / Impact-Effort)":
        "https://app.notion.com/p/37a09d9fee5881768665d1e9a4e3f28e",
      "Trade-off Framework":
        "https://app.notion.com/p/37a09d9fee588153b161e3e4670b217b",
      "Sample Answers Gallery":
        "https://app.notion.com/p/37a09d9fee58818aaaeceb3a04c7d8a9",
      "Readiness Score":
        "https://app.notion.com/p/37a09d9fee5881a2821ae8bafb52273d",
      "Category Breakdown":
        "https://app.notion.com/p/37a09d9fee588164a0f6d15c54780b91",
      "Improvement Trends":
        "https://app.notion.com/p/37a09d9fee588182b0e5f56c45b314d6",
      "👋 Welcome":
        "https://app.notion.com/p/37a09d9fee58810ca9ccf178f4fb8fda",
      "⚡ Quick Start Guide":
        "https://app.notion.com/p/37a09d9fee588184897de1718f9ee9d3",
    },
    databases: {
      "Question Bank":
        "https://app.notion.com/p/54df0f02e5a948f9828ea30468a675c5",
      "Practice Sessions":
        "https://app.notion.com/p/0c64d0c5dc0f4d9196bb8c8510e11445",
      "Mock Interview Scorecard":
        "https://app.notion.com/p/01042fdd9fe0450387770c8827d3a672",
      "Weakness Tracker":
        "https://app.notion.com/p/14c45c86bf0c4f8aa5da187bc060ac5e",
    },
    templates: {
      "Product sense answer — CIRCLES walkthrough":
        "https://app.notion.com/p/37a09d9fee5881c3ba16d026f73d64ca",
      "Metrics question — goal → metric → trade-offs":
        "https://app.notion.com/p/37a09d9fee58819f94b3d4bc074ae4bb",
      "Behavioral — STAR story builder":
        "https://app.notion.com/p/37a09d9fee58812bb24ef98bc647c5d2",
      "Prioritization — RICE scoring sheet":
        "https://app.notion.com/p/37a09d9fee5881768665d1e9a4e3f28e",
    },
    aliases: {
      "Practice Tracker": "Practice Sessions",
      "Mock Interview Log": "Mock Interview Scorecard",
    },
  },
};

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveFromMap(
  map: Record<string, string>,
  name: string,
  aliases?: Record<string, string>,
): string | undefined {
  if (map[name]) return map[name];

  const aliasKey = aliases?.[name];
  if (aliasKey) {
    if (map[aliasKey]) return map[aliasKey];
    if (aliasKey.startsWith("http")) return aliasKey;
  }

  const target = normalizeKey(name);
  for (const [key, url] of Object.entries(map)) {
    const normalized = normalizeKey(key);
    if (normalized === target) return url;
    if (normalized.includes(target) || target.includes(normalized)) return url;
  }

  return undefined;
}

/** Env override: NEXT_PUBLIC_NOTION_URL_<SLUG> e.g. NEXT_PUBLIC_NOTION_URL_PM_JOB_SEARCH_COMMAND_CENTER */
function envBundleOverride(slug: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  const key = `NEXT_PUBLIC_NOTION_URL_${slug.toUpperCase().replace(/-/g, "_")}`;
  return process.env[key];
}

export function getNotionLinks(slug: string): NotionProductLinks | undefined {
  return notionLinksBySlug[slug];
}

export function getNotionBundleUrl(slug: string): string | undefined {
  const links = notionLinksBySlug[slug];
  if (!links) return undefined;
  return envBundleOverride(slug) ?? links.bundleUrl;
}

/** @deprecated Use getNotionBundleUrl */
export function getNotionWorkspaceUrl(slug: string): string | undefined {
  return getNotionBundleUrl(slug);
}

export function getNotionEntryUrl(slug: string): string | undefined {
  const links = notionLinksBySlug[slug];
  if (!links) return undefined;
  return links.entryUrl;
}

export function getNotionPageUrl(
  slug: string,
  pageName: string,
): string | undefined {
  const links = notionLinksBySlug[slug];
  if (!links) return undefined;

  return (
    resolveFromMap(links.pages, pageName, links.aliases) ??
    resolveFromMap(links.sections, pageName) ??
    resolveFromMap(links.templates, pageName, links.aliases)
  );
}

export function getNotionDatabaseUrl(
  slug: string,
  databaseName: string,
): string | undefined {
  const links = notionLinksBySlug[slug];
  if (!links) return undefined;
  return resolveFromMap(links.databases, databaseName, links.aliases);
}

export function getNotionTemplateUrl(
  slug: string,
  templateName: string,
): string | undefined {
  const links = notionLinksBySlug[slug];
  if (!links) return undefined;
  return resolveFromMap(links.templates, templateName, links.aliases);
}

export function getNotionSectionUrl(
  slug: string,
  sectionName: string,
): string | undefined {
  const links = notionLinksBySlug[slug];
  if (!links) return undefined;
  return resolveFromMap(links.sections, sectionName);
}
