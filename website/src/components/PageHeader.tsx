import { Container } from "@/components/ui/Container";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-14 pb-6 sm:pt-20">
      <Container className="text-center">
        {eyebrow && (
          <span className="inline-block rounded-full bg-pink-100 px-4 py-1 text-sm font-semibold text-pink-400 font-[family-name:var(--font-accent)]">
            {eyebrow}
          </span>
        )}
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg text-charcoal-soft">
            {subtitle}
          </p>
        )}
      </Container>
    </header>
  );
}
