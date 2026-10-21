"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { mailHref, telHref } from "@/lib/contact";
import { blurPlaceholder } from "@/lib/images";
import { siteNav } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types";

const DEFAULT_AGENCY_NAME = "Lumina Model Management";

export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hadOpenRef = useRef(false);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;
  const showSolidBg = solid && !menuOpen;
  const lightText = menuOpen || !solid;

  const agencyName = settings?.agency_name || DEFAULT_AGENCY_NAME;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      hadOpenRef.current = true;
    } else if (hadOpenRef.current) {
      menuButtonRef.current?.focus();
    }
  }, [menuOpen]);

  const contactLinks = [
    settings?.phone
      ? { label: settings.phone, href: telHref(settings.phone) }
      : null,
    settings?.email
      ? { label: settings.email, href: mailHref(settings.email) }
      : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          showSolidBg
            ? "border-b border-ink/10 bg-paper/90 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        {contactLinks.length > 0 ? (
          <div
            className={cn(
              "hidden border-b transition-colors duration-500 lg:block",
              lightText ? "border-paper/10" : "border-ink/10"
            )}
          >
            <Container className="flex h-9 items-center justify-end gap-8">
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-gold",
                    lightText ? "text-paper/80" : "text-ink/60"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </Container>
          </div>
        ) : null}

        <Container className="flex h-16 items-center justify-between lg:h-20">
          <Link
            href="/"
            aria-label={`${agencyName} — home`}
            className="relative z-50 flex items-center"
          >
            {settings?.logo_url ? (
              <Image
                src={settings.logo_url}
                alt={agencyName}
                width={140}
                height={36}
                placeholder="blur"
                blurDataURL={blurPlaceholder}
                className={cn(
                  "h-8 w-auto object-contain object-left transition-[filter] duration-500",
                  lightText && "brightness-0 invert"
                )}
              />
            ) : (
              <span
                className={cn(
                  "font-serif text-xl tracking-[0.06em] transition-colors duration-500 lg:text-2xl",
                  lightText ? "text-paper" : "text-ink"
                )}
              >
                {agencyName}
              </span>
            )}
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {siteNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-gold",
                        active
                          ? "text-gold"
                          : lightText
                            ? "text-paper/80"
                            : "text-ink/70"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "relative z-50 flex h-11 w-11 flex-col items-center justify-center transition-colors duration-500 lg:hidden",
              lightText ? "text-paper" : "text-ink"
            )}
          >
            <span
              className={cn(
                "block h-px w-7 bg-current transition-transform duration-300",
                menuOpen && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "mt-[7px] block h-px w-7 bg-current transition-transform duration-300",
                menuOpen && "-translate-y-[4px] -rotate-45"
              )}
            />
          </button>
        </Container>
      </header>

      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={cn(
          "fixed inset-0 z-40 bg-ink transition-opacity duration-500 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-full flex-col justify-center px-8 pb-16 pt-24">
          <nav aria-label="Mobile">
            <ul>
              {siteNav.map((item, index) => {
                const active = pathname === item.href;
                return (
                  <li
                    key={item.href}
                    className={cn(
                      "transition-all duration-700 ease-out",
                      menuOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    )}
                    style={{
                      transitionDelay: menuOpen
                        ? `${120 + index * 80}ms`
                        : "0ms",
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block py-2 font-serif text-4xl font-light leading-tight text-paper transition-colors hover:text-gold md:text-5xl",
                        active && "text-gold"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {contactLinks.length > 0 ? (
            <div
              className={cn(
                "mt-12 border-t border-paper/10 pt-8 transition-all duration-700 ease-out",
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: menuOpen ? "520ms" : "0ms" }}
            >
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-1 text-sm text-paper/70 transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
