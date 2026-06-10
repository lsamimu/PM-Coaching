import { Container } from "./Container";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  containerClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-lavender-100 px-4 py-1 text-sm font-semibold text-lavender-700 font-[family-name:var(--font-accent)]">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold text-charcoal sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-charcoal-soft">{subtitle}</p>
      )}
    </div>
  );
}
