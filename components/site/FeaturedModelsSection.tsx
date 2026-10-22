import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { ModelGrid } from "@/components/site/ModelGrid";
import { DEFAULT_MODELS } from "@/lib/defaults";
import { getModels } from "@/lib/models";

export async function FeaturedModelsSection() {
  const fetched = await getModels({ limit: 6 });
  const isPlaceholder = fetched === null;
  const models = fetched ?? DEFAULT_MODELS;

  if (models.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-ink/10 py-24 md:py-32">
      <Container>
        <FadeIn>
          <SectionHeading
            align="center"
            eyebrow="The Board"
            title="Featured Talent"
            description="A selection from our current board — browse the full roster or filter by category."
          />
        </FadeIn>

        <ModelGrid models={models} disableLinks={isPlaceholder} />

        <FadeIn className="mt-14 text-center">
          <Button variant="outline" href="/models" showArrow>
            View all models
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}
