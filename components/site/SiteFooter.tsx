import Link from "next/link";
import { Container } from "@/components/Container";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/site/icons";
import { mailHref, telHref, waHref } from "@/lib/contact";
import {
  DEFAULT_CONTACT,
  DEFAULT_SOCIALS,
  DEFAULT_TAGLINE,
} from "@/lib/defaults";
import { siteNav } from "@/lib/site-nav";
import { getCopyrightYear, getSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/types";

const DEFAULT_AGENCY_NAME = "Lumina Model Management";

type Social = {
  label: string;
  href: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
};

function buildSocials(settings: SiteSettings | null): Social[] {
  const socials: Social[] = [];

  const instagram = settings ? settings.instagram : DEFAULT_SOCIALS.instagram;
  const facebook = settings ? settings.facebook : DEFAULT_SOCIALS.facebook;
  const tiktok = settings ? settings.tiktok : DEFAULT_SOCIALS.tiktok;

  if (instagram) {
    socials.push({ label: "Instagram", href: instagram, Icon: InstagramIcon });
  }
  if (facebook) {
    socials.push({ label: "Facebook", href: facebook, Icon: FacebookIcon });
  }
  if (tiktok) {
    socials.push({ label: "TikTok", href: tiktok, Icon: TikTokIcon });
  }

  return socials;
}

export async function SiteFooter() {
  const [settings, year] = await Promise.all([
    getSiteSettings(),
    getCopyrightYear(),
  ]);

  const agencyName = settings?.agency_name || DEFAULT_AGENCY_NAME;
  const tagline = settings ? settings.tagline : DEFAULT_TAGLINE;
  const email = settings ? settings.email : DEFAULT_CONTACT.email;
  const phone = settings ? settings.phone : DEFAULT_CONTACT.phone;
  const whatsapp = settings ? settings.whatsapp : DEFAULT_CONTACT.whatsapp;
  const address = settings ? settings.address : DEFAULT_CONTACT.address;
  const socials = buildSocials(settings);

  const contactItems = [
    email ? { label: email, href: mailHref(email) } : null,
    phone ? { label: phone, href: telHref(phone) } : null,
    whatsapp ? { label: "WhatsApp", href: waHref(whatsapp) } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <footer className="bg-ink text-paper">
      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="max-w-lg font-serif text-5xl font-light leading-[1.05] tracking-[-0.01em] md:text-6xl lg:text-7xl">
              {agencyName}
            </p>
            {tagline ? (
              <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/60">
                {tagline}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:justify-items-end lg:gap-16">
            <nav aria-label="Footer">
              <h2 className="text-[11px] font-sans uppercase tracking-[0.3em] text-paper/40">
                Explore
              </h2>
              <ul className="mt-6 space-y-3">
                {siteNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-paper/80 transition-colors hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-[11px] font-sans uppercase tracking-[0.3em] text-paper/40">
                Contact
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-paper/80">
                {contactItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="transition-colors hover:text-gold"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                {address ? (
                  <li className="leading-relaxed text-paper/60">
                    {address}
                  </li>
                ) : null}
              </ul>
            </div>

            {socials.length > 0 ? (
              <div>
                <h2 className="text-[11px] font-sans uppercase tracking-[0.3em] text-paper/40">
                  Follow
                </h2>
                <ul className="mt-6 flex items-center gap-5">
                  {socials.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="block text-paper/60 transition-colors hover:text-gold"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/10 pt-8 text-[11px] uppercase tracking-[0.2em] text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>
            {settings?.footer_text ?? `© ${year} ${agencyName}. All rights reserved.`}
          </p>
        </div>
      </Container>
    </footer>
  );
}
