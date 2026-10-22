import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { ScrollScaleImage } from "@/components/site/ScrollScaleImage";
import { DEFAULT_SECTIONS } from "@/lib/defaults";
import { getSections } from "@/lib/sections";
import { cn } from "@/lib/utils";
import type { Section } from "@/types";

function SectionText({ section }: { section: Section }) {
  return (
    <div className="mx-auto max-w-md">
      {section.subtitle ? (
        <p className="text-[11px] uppercase tracking-[0.35em] text-ink/50">
          {section.subtitle}
        </p>
      ) : null}
      <h2 className="mt-5 font-serif text-4xl font-light leading-[1.08] tracking-[-0.01em] md:text-5xl">
        {section.title}
      </h2>
      {section.description ? (
        <p className="mt-6 text-sm leading-relaxed text-ink/70">
          {section.description}
        </p>
      ) : null}
    </div>
  );
}

function SplitSection({ section }: { section: Section }) {
  const imageLeft = section.layout === "image-left";

  return (
    <div className="grid items-stretch lg:grid-cols-5">
      <div
        className={cn(
          "lg:col-span-3",
          imageLeft ? "lg:order-1" : "lg:order-2"
        )}
      >
        {section.image_url ? (
          <ScrollScaleImage
            src={section.image_url}
            alt={section.title}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="aspect-[4/5] lg:h-full lg:min-h-[36rem] lg:aspect-auto"
          />
        ) : (
          <div className="aspect-[4/5] bg-paper-soft lg:h-full lg:min-h-[36rem] lg:aspect-auto" />
        )}
      </div>
      <div
        className={cn(
          "flex items-center px-6 py-16 sm:px-10 lg:col-span-2 lg:px-14 lg:py-20",
          imageLeft ? "lg:order-2" : "lg:order-1"
        )}
      >
        <FadeIn className="w-full">
          <SectionText section={section} />
        </FadeIn>
      </div>
    </div>
  );
}

function FullBleedSection({ section }: { section: Section }) {
  return (
    <section className="relative h-[80vh] min-h-[30rem] overflow-hidden bg-ink">
      {section.image_url ? (
        <ScrollScaleImage
          src={section.image_url}
          alt={section.title}
          sizes="100vw"
          className="skeleton-dark absolute inset-0"
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 pb-14 md:pb-20">
        <Container>
          <FadeIn className="max-w-2xl text-paper">
            {section.subtitle ? (
              <p className="text-[11px] uppercase tracking-[0.35em] text-paper/60">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="mt-5 font-serif text-4xl font-light leading-[1.06] tracking-[-0.01em] md:text-5xl lg:text-6xl">
              {section.title}
            </h2>
            {section.description ? (
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/70">
                {section.description}
              </p>
            ) : null}
          </FadeIn>
        </Container>
      </div>
    </section>
  );
}

export async function ContentSections() {
  const sections = (await getSections()) ?? DEFAULT_SECTIONS;

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) =>
        section.layout === "full-bleed" ? (
          <FullBleedSection key={section.id} section={section} />
        ) : (
          <SplitSection key={section.id} section={section} />
        )
      )}
    </>
  );
}
