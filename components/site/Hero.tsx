import Image from "next/image";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { getHero } from "@/lib/hero";
import { blurPlaceholderDark } from "@/lib/images";

const DEFAULT_HEADLINE = "Faces That Define the Season";

export async function Hero() {
  const hero = await getHero();

  const headline = hero?.headline || DEFAULT_HEADLINE;
  const subheadline = hero?.subheadline ?? null;
  const primary =
    hero?.cta_label && hero?.cta_link
      ? { label: hero.cta_label, href: hero.cta_link }
      : null;
  const secondary =
    hero?.secondary_cta_label && hero?.secondary_cta_link
      ? { label: hero.secondary_cta_label, href: hero.secondary_cta_link }
      : null;
  const hasCtas = primary !== null || secondary !== null;

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink">
      {hero?.background_image_url ? (
        <Image
          fill
          src={hero.background_image_url}
          alt=""
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurPlaceholderDark}
          className="animate-ken-burns object-cover"
        />
      ) : null}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/45 to-ink/70"
      />

      <Container className="relative z-10 py-36 text-center text-paper">
        <h1
          className="animate-fade-up mx-auto max-w-4xl font-serif text-5xl font-light leading-[1.03] tracking-[-0.015em] sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0ms" }}
        >
          {headline}
        </h1>

        {subheadline ? (
          <p
            className="animate-fade-up mx-auto mt-7 max-w-2xl text-[11px] uppercase leading-[1.9] tracking-[0.28em] text-paper/75 md:text-xs"
            style={{ animationDelay: "180ms" }}
          >
            {subheadline}
          </p>
        ) : null}

        {hasCtas ? (
          <div
            className="animate-fade-up mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "360ms" }}
          >
            {primary ? (
              <Button href={primary.href} tone="light" size="lg">
                {primary.label}
              </Button>
            ) : null}
            {secondary ? (
              <Button
                href={secondary.href}
                variant="outline"
                tone="light"
                size="lg"
              >
                {secondary.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </Container>

      <div
        aria-hidden
        className="animate-fade-up absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ animationDelay: "600ms" }}
      >
        <div className="h-14 w-px overflow-hidden bg-paper/25">
          <div className="animate-scroll-dot h-4 w-px bg-paper/80" />
        </div>
      </div>
    </section>
  );
}
