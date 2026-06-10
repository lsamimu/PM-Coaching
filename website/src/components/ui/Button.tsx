import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "mint";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-visible:outline-none disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-lavender-400 text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] hover:bg-lavender-500 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-8px_rgba(124,58,237,0.7)]",
  secondary:
    "bg-pink-300 text-charcoal shadow-[0_10px_30px_-8px_rgba(244,114,182,0.6)] hover:bg-pink-400 hover:text-white hover:-translate-y-0.5",
  mint:
    "bg-mint-300 text-charcoal shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] hover:bg-mint-400 hover:-translate-y-0.5",
  ghost:
    "bg-white/70 text-charcoal ring-1 ring-lavender-200 backdrop-blur hover:bg-white hover:ring-lavender-300",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-lg px-8 py-4",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & {
  href?: string;
  external?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
