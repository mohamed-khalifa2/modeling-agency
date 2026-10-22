import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { ContentSections } from "@/components/site/ContentSections";

export const metadata = {
  title: "About",
  description:
    "A boutique New York modeling agency built on individuality — meet the people and philosophy behind the board.",
  openGraph: {
    title: "About",
    description:
      "A boutique New York modeling agency built on individuality.",
  },
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-ink/10 pb-14 pt-36 md:pb-16 md:pt-44">
        <Container>
          <FadeIn>
            <SectionHeading
              align="center"
              as="h1"
              eyebrow="Who we are"
              title="About the Agency"
              description="A boutique house built on individuality — introducing the people, philosophy, and board behind the work."
            />
          </FadeIn>
        </Container>
      </section>

      <ContentSections />

      <section className="border-t border-ink/10 py-24 md:py-32">
        <Container>
          <FadeIn className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold-deep">
                Join us
              </p>
              <p className="mt-4 max-w-xl font-serif text-3xl font-light leading-tight md:text-4xl">
                Interested in representation? We would love to meet you.
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
