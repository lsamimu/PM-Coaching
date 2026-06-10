"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Rocket } from "lucide-react";
import { nav, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 shadow-[0_4px_30px_-12px_rgba(124,58,237,0.3)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-charcoal"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-lavender-400 text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.7)]">
            <Rocket className="h-5 w-5" />
          </span>
          <span className="font-[family-name:var(--font-heading)]">
            {site.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-lavender-100 text-lavender-700"
                      : "text-charcoal-soft hover:bg-lavender-50 hover:text-lavender-700",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href={site.calendly} external size="sm">
            Book a Call
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70 text-charcoal ring-1 ring-lavender-200 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden">
          <ul className="mx-4 mb-4 space-y-1 rounded-3xl bg-white/95 p-3 shadow-soft ring-1 ring-lavender-100 backdrop-blur">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-charcoal hover:bg-lavender-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button href={site.calendly} external className="w-full">
                Book a Discovery Call
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
