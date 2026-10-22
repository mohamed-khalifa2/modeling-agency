import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { ModelGrid } from "@/components/site/ModelGrid";
import { DEFAULT_MODELS } from "@/lib/defaults";
import { getModels } from "@/lib/models";

export const metadata = {
  title: "Models",
  description:
    "Browse the full board — women, men, new faces, and kids. Filter by category to narrow the roster.",
  openGraph: {
    title: "Models",
    description:
      "Browse the full board — women, men, new faces, and kids.",
  },
};

export default async function ModelsPage() {
  const fetched = await getModels();
  const isPlaceholder = fetched === null;
  const models = fetched ?? (isPlaceholder ? DEFAULT_MODELS : []);

  return (
    <div>
      <section className="border-b border-ink/10 pb-14 pt-36 md:pb-16 md:pt-44">
        <Container>
          <FadeIn>
            <SectionHeading
              align="center"
              as="h1"
              eyebrow="The Board"
              title="Models"
              description="Browse the full roster. Filter by category to narrow the board."
            />
          </FadeIn>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <ModelGrid models={models} disableLinks={isPlaceholder} />
        </Container>
      </section>
    </div>
  );
}
