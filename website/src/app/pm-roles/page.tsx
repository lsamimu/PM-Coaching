import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { JobTracker } from "@/components/JobTracker";
import { PMRolesTeaser } from "@/components/PMRolesTeaser";
import { getJobs } from "@/lib/jobs";
import { getUnlockedEmail, priceLabel } from "@/lib/access";
import { venmoDisplayHandle, venmoPayUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Live PM Roles",
  description:
    "Lifetime access to an always-updating list of live Product Management roles — internships, associate PM, product analyst, and full-time PM jobs. Search, filter, sort, and save.",
};

const LOCKED_NOTICES: Record<string, string> = {
  "approve-done":
    "Access approved — the buyer should receive their link by email shortly.",
  "approve-invalid":
    "That approve link is invalid or expired. Request a new payment confirmation from the buyer.",
  "unlock-invalid":
    "That access link expired or isn't valid. Enter your email below for a fresh one.",
};

export default async function PMRolesPage({
  searchParams,
}: {
  searchParams: Promise<{ unlock?: string; welcome?: string; approve?: string; email?: string }>;
}) {
  const sp = await searchParams;
  const email = await getUnlockedEmail();
  const { jobs, categories, generated_at, count } = getJobs();

  if (email) {
    const showWelcome = sp.welcome === "1";

    return (
      <>
        <PageHeader
          eyebrow="Lifetime access"
          title="Live PM Roles"
          subtitle={`Browse ${count}+ live PM roles — search, filter, sort, and save the ones you love.`}
        />
        <Section className="pt-6">
          {showWelcome && (
            <div className="mb-6 rounded-2xl bg-mint-100 px-5 py-4 text-center text-sm font-semibold text-charcoal ring-1 ring-mint-200">
              You&apos;re in — the full list is unlocked. We also emailed you a
              link so you can come back anytime on any device.
            </div>
          )}
          <JobTracker
            jobs={jobs}
            categoryCounts={categories}
            generatedAt={generated_at}
          />
        </Section>
      </>
    );
  }

  const noticeKey =
    (sp.approve === "done" &&
      (sp.email
        ? `Access granted to ${sp.email} — they should receive their link by email.`
        : LOCKED_NOTICES["approve-done"])) ||
    (sp.approve === "invalid" && LOCKED_NOTICES["approve-invalid"]) ||
    (sp.unlock === "invalid" && LOCKED_NOTICES["unlock-invalid"]) ||
    undefined;

  return (
    <>
      <PageHeader
        eyebrow="Flagship feature"
        title="Live PM Roles"
        subtitle={`${count}+ live PM roles, refreshed continuously. Unlock the full searchable list with a one-time Venmo payment.`}
      />
      <Section className="pt-6">
        <PMRolesTeaser
          count={count}
          categories={categories}
          generatedAt={generated_at}
          priceLabel={priceLabel()}
          venmoHandle={venmoDisplayHandle()}
          venmoPayUrl={venmoPayUrl("Live PM Roles")}
          notice={noticeKey}
        />
      </Section>
    </>
  );
}
