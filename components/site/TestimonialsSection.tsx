import Image from "next/image";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { blurPlaceholder } from "@/lib/images";
import { DEFAULT_TESTIMONIALS } from "@/lib/defaults";
import { getTestimonials } from "@/lib/testimonials";

export async function TestimonialsSection() {
  const testimonials = (await getTestimonials()) ?? DEFAULT_TESTIMONIALS;

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-ink/10 py-24 md:py-32">
      <Container>
        <FadeIn>
          <SectionHeading
            align="center"
            eyebrow="Clients"
            title="In Good Company"
          />
        </FadeIn>

        <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeIn
              key={testimonial.id}
              delay={index * 80}
              className="flex flex-col justify-between bg-paper p-8 md:p-10"
            >
              {testimonial.quote ? (
                <blockquote>
                  <p className="font-serif text-xl font-light leading-relaxed md:text-2xl">
                    “{testimonial.quote}”
                  </p>
                  <footer className="mt-8 text-[11px] uppercase tracking-[0.3em] text-ink/50">
                    {testimonial.name}
                  </footer>
                </blockquote>
              ) : (
                <div className="flex flex-1 flex-col justify-center">
                  {testimonial.logo_url ? (
                    <Image
                      src={testimonial.logo_url}
                      alt={testimonial.name}
                      width={160}
                      height={64}
                      placeholder="blur"
                      blurDataURL={blurPlaceholder}
                      className="h-12 w-auto object-contain object-left"
                    />
                  ) : (
                    <p className="font-serif text-2xl font-light">
                      {testimonial.name}
                    </p>
                  )}
                </div>
              )}
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
