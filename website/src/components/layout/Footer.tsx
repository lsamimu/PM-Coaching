import Link from "next/link";
import { Rocket, Mail } from "lucide-react";
import { nav, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { LinkedInIcon, XIcon, YouTubeIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-lavender-100 bg-white/60">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-charcoal">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-lavender-400 text-white">
                <Rocket className="h-5 w-5" />
              </span>
              <span className="font-[family-name:var(--font-heading)]">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-charcoal-soft">
              {site.tagline}
            </p>
            <div className="mt-5 flex gap-3">
              <SocialIcon href={site.social.linkedin} label="LinkedIn">
                <LinkedInIcon className="h-4.5 w-4.5" />
              </SocialIcon>
              <SocialIcon href={site.social.twitter} label="Twitter / X">
                <XIcon className="h-4.5 w-4.5" />
              </SocialIcon>
              <SocialIcon href={site.social.youtube} label="YouTube">
                <YouTubeIcon className="h-4.5 w-4.5" />
              </SocialIcon>
              <SocialIcon href={`mailto:${site.email}`} label="Email">
                <Mail className="h-4.5 w-4.5" />
              </SocialIcon>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-charcoal-soft transition-colors hover:text-lavender-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal">
              The PM Launch Letter
            </h3>
            <p className="mt-4 text-sm text-charcoal-soft">
              Open PM roles, internship roundups, AI tools, and career advice —
              weekly.
            </p>
            <Link
              href="/newsletter"
              className="mt-4 inline-block rounded-full bg-mint-300 px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-mint-400"
            >
              Subscribe free →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-lavender-100 pt-6 text-sm text-charcoal-soft sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Made with 💜 for future
            PMs.
          </p>
          <p>Built by {site.founder}.</p>
        </div>
      </Container>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-charcoal-soft ring-1 ring-lavender-200 transition-all hover:-translate-y-0.5 hover:text-lavender-600 hover:ring-lavender-300"
    >
      {children}
    </a>
  );
}
