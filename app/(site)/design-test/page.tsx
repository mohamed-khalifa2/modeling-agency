import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { ImageWithOverlay } from "@/components/ImageWithOverlay";
import { SectionHeading } from "@/components/SectionHeading";

const palette = [
  { name: "Ink", hex: "#0A0A0A", role: "Primary text, solid buttons, dark sections", swatch: "bg-ink", light: false },
  { name: "Paper", hex: "#F5F2ED", role: "Page background, text on dark", swatch: "bg-paper", light: true },
  { name: "Gold", hex: "#B69E6B", role: "Hairline rules, accent on dark", swatch: "bg-gold", light: false },
  { name: "Gold Deep", hex: "#7E6842", role: "Accent text and links on light", swatch: "bg-gold-deep", light: false },
];

const fadeInCards = [
  { number: "01", title: "Scout", text: "Every application reviewed personally by our scouting team." },
  { number: "02", title: "Develop", text: "Portfolio strategy, test shoots, and on-set guidance from day one." },
  { number: "03", title: "Represent", text: "Negotiated placements across editorial, runway, and commercial." },
];

export default function DesignTestPage() {
  return (
    <div className="flex-1">
      <section className="border-b border-ink/10 pb-28 pt-36 md:pb-36 md:pt-44">
        <Container>
          <FadeIn>
            <SectionHeading
              align="center"
              as="h1"
              eyebrow="Design System"
              title="Editorial Foundations"
              description="A review of the palette, typography, and core components for the agency site. Muted gold on warm paper, near-black ink, hairline rules, and unhurried motion."
            />
          </FadeIn>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-24 md:py-32">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Palette"
              title="Ink, Paper & Muted Gold"
              description="One near-black, one warm off-white, and a single muted gold accent in two depths — everything else is opacity."
            />
          </FadeIn>
          <div className="mt-14 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {palette.map((color, i) => (
              <FadeIn key={color.name} delay={i * 80} className="bg-paper">
                <div className="p-6">
                  <div className={`h-24 w-full ${color.swatch} ${color.light ? "border border-ink/10" : ""}`} />
                  <p className="mt-5 font-serif text-2xl font-light">{color.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] opacity-60">{color.hex}</p>
                  <p className="mt-3 text-xs leading-relaxed opacity-70">{color.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-24 md:py-32">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Typography"
              title="Light Serif, Restrained Sans"
              description="Cormorant Garamond at weight 300 for display sizes; Inter in small sizes with generous line height for body copy."
            />
          </FadeIn>

          <FadeIn delay={100} className="mt-16 grid gap-14 lg:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] opacity-50">Display / H1 / Cormorant 300</p>
              <h1 className="mt-4 font-serif text-5xl font-light leading-[1.04] md:text-6xl lg:text-7xl">
                Faces That Define the Season
              </h1>
              <p className="mt-8 text-[11px] uppercase tracking-[0.3em] opacity-50">Heading / H3 / Cormorant 300</p>
              <h3 className="mt-3 font-serif text-3xl font-light">A Board as Diverse as the Industry</h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] opacity-50">Eyebrow label / Inter / tracking 0.35em</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.35em]">Applications now open</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] opacity-50">Body / Inter / 15px / 1.7</p>
                <p className="mt-3 max-w-prose text-sm leading-relaxed">
                  Lumina Model Management was founded on a simple belief: every career should be as
                  unique as the face behind it. We pair rigorous development with personal
                  representation, guiding talent from first test shoots to international campaigns.
                </p>
              </div>
              <div className="border-t border-ink/10 pt-8">
                <p className="text-[11px] uppercase tracking-[0.3em] opacity-50">Hairline divider / 1px / ink 10%</p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-24 md:py-32">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Components"
              title="Buttons"
              description="Sharp corners, uppercase labels, wide tracking. Solid, outline, and text-link variants in two tones."
            />
          </FadeIn>

          <FadeIn delay={100} className="mt-14 space-y-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] opacity-50">Solid / dark tone</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button>Medium</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] opacity-50">Outline / dark tone</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Button variant="outline" size="sm">Small</Button>
                <Button variant="outline">Medium</Button>
                <Button variant="outline" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] opacity-50">Text link / dark tone</p>
              <div className="mt-4 flex flex-wrap items-center gap-8">
                <Button variant="text">View the board</Button>
                <Button variant="text" showArrow>
                  Read more
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-ink py-24 text-paper md:py-32">
        <Container>
          <FadeIn>
            <SectionHeading
              align="center"
              eyebrow="On dark"
              title="The Same System, Inverted"
              description="Light-tone buttons and gold hairlines sit on near-black for hero moments and editorial breaks."
            />
          </FadeIn>

          <FadeIn delay={100} className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <Button tone="light">Solid light</Button>
            <Button variant="outline" tone="light">
              Outline light
            </Button>
            <Button variant="text" tone="light" showArrow>
              Text light
            </Button>
          </FadeIn>

          <FadeIn delay={200} className="mx-auto mt-24 max-w-3xl text-center">
            <SectionHeading
              align="center"
              as="h3"
              eyebrow="Centered heading"
              title="Gold Rule, Generous Space"
            />
          </FadeIn>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-24 md:py-32">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="ImageWithOverlay"
              title="Slow Zoom, Quiet Overlay"
              description="A 1.4-second zoom on hover with an optional gradient overlay for captions. Sharp corners, no shadows."
            />
          </FadeIn>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FadeIn delay={0}>
              <ImageWithOverlay
                src="https://placehold.co/800x1000/c9b8a8/1a1a1a?text=Amara"
                alt="Model portrait, example one"
                ratio="aspect-[4/5]"
                sizes="(max-width: 768px) 100vw, 33vw"
                overlay="none"
              />
            </FadeIn>
            <FadeIn delay={120}>
              <ImageWithOverlay
                src="https://placehold.co/800x1000/b8c4c9/1a1a1a?text=Elodie"
                alt="Model portrait, example two"
                ratio="aspect-[4/5]"
                sizes="(max-width: 768px) 100vw, 33vw"
                overlay="subtle"
              />
            </FadeIn>
            <FadeIn delay={240}>
              <ImageWithOverlay
                src="https://placehold.co/800x1000/a8b8c9/1a1a1a?text=Julian"
                alt="Model portrait with caption"
                ratio="aspect-[4/5]"
                sizes="(max-width: 768px) 100vw, 33vw"
                overlay="strong"
                caption={
                  <>
                    <p className="font-serif text-2xl font-light">Julian Reyes</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.3em] opacity-70">
                      Men — Board
                    </p>
                  </>
                }
              />
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-24 md:py-32">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="FadeIn"
              title="Unhurried Scroll Reveals"
              description="Fade and 24px rise over 800ms on an ease-out curve, staggered by delay. Reduced-motion preferences are respected."
            />
          </FadeIn>

          <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-3">
            {fadeInCards.map((card, i) => (
              <FadeIn
                key={card.number}
                delay={i * 150}
                className="bg-paper p-8 md:p-10"
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold-deep">
                  {card.number}
                </p>
                <p className="mt-6 font-serif text-3xl font-light">{card.title}</p>
                <p className="mt-4 text-sm leading-relaxed opacity-70">{card.text}</p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-32">
        <Container>
          <FadeIn className="flex flex-col items-center gap-10 text-center">
            <SectionHeading
              align="center"
              as="h3"
              eyebrow="Review"
              title="Ready When You Are"
              description="Everything above is token-driven — swapping the gold accent or adjusting the serif scale updates the whole site."
            />
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg">Approve the system</Button>
              <Button variant="outline" size="lg" href="/design-test">
                Back to top
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
