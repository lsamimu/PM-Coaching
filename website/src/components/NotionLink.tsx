import { ExternalLink } from "lucide-react";

type NotionLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
};

export function NotionLink({
  href,
  children,
  className = "",
  showIcon = true,
}: NotionLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-1.5 text-lavender-600 underline decoration-lavender-200 underline-offset-2 transition-colors hover:text-lavender-700 hover:decoration-lavender-400 ${className}`}
    >
      {children}
      {showIcon && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
      )}
    </a>
  );
}

type NotionAccessBarProps = {
  bundleUrl: string;
  productTitle: string;
};

export function NotionAccessBar({ bundleUrl, productTitle }: NotionAccessBarProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-lavender-200 bg-lavender-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-bold text-charcoal">Your Notion bundle</p>
        <p className="text-xs text-charcoal-soft">
          Opens the full {productTitle} workspace — 7 sections, databases, and
          templates. Duplicate to your Notion account to start.
        </p>
      </div>
      <a
        href={bundleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-lavender-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lavender-500"
      >
        <ExternalLink className="h-4 w-4" />
        Open Notion bundle
      </a>
    </div>
  );
}
