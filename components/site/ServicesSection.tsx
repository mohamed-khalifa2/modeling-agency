import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { ServicesList } from "@/components/site/ServicesList";

export function ServicesSection() {
  return (
    <section className="border-t border-ink/10 py-24 md:py-32">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="What we do"
            title="Services"
            description="From first test to global campaign — representation across every stage of a model's career."
          />
        </FadeIn>

        <div className="mt-14">
          <ServicesList />
        </div>
      </Container>
    </section>
  );
}
