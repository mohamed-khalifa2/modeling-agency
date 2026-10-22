import { Suspense } from "react";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/site/ContactForm";
import { mailHref, telHref, waHref } from "@/lib/contact";
import { DEFAULT_CONTACT } from "@/lib/defaults";
import { getSiteSettings } from "@/lib/site-settings";

export async function ContactSection() {
  const settings = await getSiteSettings();

  const email = settings ? settings.email : DEFAULT_CONTACT.email;
  const phone = settings ? settings.phone : DEFAULT_CONTACT.phone;
  const whatsapp = settings ? settings.whatsapp : DEFAULT_CONTACT.whatsapp;
  const address = settings ? settings.address : DEFAULT_CONTACT.address;

  const details = [
    email ? { label: email, href: mailHref(email) } : null,
    phone ? { label: phone, href: telHref(phone) } : null,
    whatsapp ? { label: "WhatsApp", href: waHref(whatsapp) } : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  return (
    <section
      id="contact"
      className="scroll-mt-28 border-t border-ink/10 py-24 md:py-32"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <FadeIn>
            <SectionHeading
              eyebrow="Contact"
              title="Begin the Conversation"
              description="Casting inquiries, bookings, and applications — tell us about your project and we'll respond within two business days."
            />

            {details.length > 0 || address ? (
              <div className="mt-10 space-y-3 text-sm">
                {details.map((item) => (
                  <p key={item.href}>
                    <a
                      href={item.href}
                      className="text-ink/70 transition-colors hover:text-gold-deep"
                    >
                      {item.label}
                    </a>
                  </p>
                ))}
                {address ? (
                  <p className="leading-relaxed text-ink/50">{address}</p>
                ) : null}
              </div>
            ) : null}
          </FadeIn>

          <FadeIn delay={120}>
            <Suspense
              fallback={
                <div
                  aria-hidden
                  className="h-[28rem] animate-pulse bg-ink/5"
                />
              }
            >
              <ContactForm />
            </Suspense>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
