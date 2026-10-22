import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { ServicesList } from "@/components/site/ServicesList";

export const metadata = {
  title: "Services",
  description:
    "Editorial and campaign representation, runway and show production, and brand partnerships — full-service management for every stage of a model's career.",
  openGraph: {
    title: "Services",
    description:
      "Editorial, runway, and brand partnership representation from a boutique New York agency.",
  },
};

export default function ServicesPage() {
  return (
    <div>
      <section className="border-b border-ink/10 pb-14 pt-36 md:pb-16 md:pt-44">
        <Container>
          <FadeIn>
            <SectionHeading
              align="center"
              as="h1"
              eyebrow="What we do"
              title="Services"
              description="From first test to global campaign — representation across every stage of a model's career."
            />
          </FadeIn>
        </Container>
      </section>

      <section className="pt-16 md:pt-24">
        <Container>
          <ServicesList />
        </Container>
      </section>

      <section className="border-t border-ink/10 py-24 md:py-32">
        <Container>
          <FadeIn className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold-deep">
                Start a conversation
              </p>
              <p className="mt-4 max-w-xl font-serif text-3xl font-light leading-tight md:text-4xl">
                Have a brief, a casting, or a career question?
              </p>
            </div>
            <Button href="/#contact" size="lg" showArrow>
              Get in touch
            </Button>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
