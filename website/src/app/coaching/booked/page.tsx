import type { Metadata } from "next";
import { Calendar, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { services } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Payment received — book your time",
  robots: { index: false },
};

export default async function BookedPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: slug } = await searchParams;
  const service = services.find((s) => s.slug === slug);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald text-white">
        <Check className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-charcoal sm:text-4xl">
        Payment received — thank you! 💜
      </h1>
      <p className="mt-3 max-w-md text-charcoal-soft">
        {service
          ? `You're all set for your ${service.title}. The last step is to pick a time that works for you.`
          : "You're all set. The last step is to pick a time that works for you."}
      </p>

      <a
        href={site.calendly}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-lavender-400 px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-0.5 hover:bg-lavender-500"
      >
        <Calendar className="h-5 w-5" />
        Pick your time
      </a>
      <p className="mt-4 text-sm text-charcoal-soft">
        A receipt and confirmation will arrive in your inbox.
      </p>
    </Container>
  );
}
