import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { Skeleton } from "@/components/Skeleton";
import { ScrollScaleImage } from "@/components/site/ScrollScaleImage";
import { mailHref, waHref } from "@/lib/contact";
import { DEFAULT_CONTACT } from "@/lib/defaults";
import { blurPlaceholder } from "@/lib/images";
import { getModelDetail } from "@/lib/models";
import { getSiteSettings } from "@/lib/site-settings";
import { modelCategoryLabels } from "@/types";

export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/models/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getModelDetail(slug);

  if (!detail) {
    return { title: "Model not found" };
  }

  const { model } = detail;
  const description = (
    model.bio?.trim() ||
    `${model.name} — ${modelCategoryLabels[model.category]} represented by the agency. View portfolio, measurements, and booking details.`
  ).slice(0, 160);

  return {
    title: model.name,
    description,
    openGraph: {
      title: model.name,
      description,
      images: model.cover_image_url
        ? [{ url: model.cover_image_url, alt: model.name }]
        : undefined,
    },
  };
}

function statFields(model: {
  height: string | null;
  bust: string | null;
  waist: string | null;
  hips: string | null;
  shoes: string | null;
  hair: string | null;
  eyes: string | null;
}) {
  return [
    { key: "height", label: "Height", value: model.height },
    { key: "bust", label: "Bust", value: model.bust },
    { key: "waist", label: "Waist", value: model.waist },
    { key: "hips", label: "Hips", value: model.hips },
    { key: "shoes", label: "Shoes", value: model.shoes },
    { key: "hair", label: "Hair", value: model.hair },
    { key: "eyes", label: "Eyes", value: model.eyes },
  ] as const;
}

function ModelDetailSkeleton() {
  return (
    <div>
      <section className="border-b border-ink/10 pb-10 pt-32 md:pb-12 md:pt-40">
        <Container>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-6 h-12 w-80 max-w-full md:h-16" />
        </Container>
      </section>
      <section className="py-12 md:py-16">
        <Container>
          <Skeleton className="aspect-[4/5] w-full md:aspect-[16/10]" />
        </Container>
      </section>
    </div>
  );
}

async function ModelDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getModelDetail(slug);

  if (!detail) {
    notFound();
  }

  const { model, images } = detail;
  const gallery =
    images.length > 0
      ? images.map((image) => image.image_url)
      : model.cover_image_url
        ? [model.cover_image_url]
        : [];

  const stats = statFields(model).filter((stat) => stat.value);

  const settings = await getSiteSettings();
  const contactEmail = settings ? settings.email : DEFAULT_CONTACT.email;
  const contactWhatsapp = settings
    ? settings.whatsapp
    : DEFAULT_CONTACT.whatsapp;
  const bookHref = `/?model=${model.slug}&modelName=${encodeURIComponent(model.name)}#contact`;

  return (
    <div>
      <section className="border-b border-ink/10 pb-10 pt-32 md:pb-12 md:pt-40">
        <Container>
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.35em] text-ink/50">
              {modelCategoryLabels[model.category]}
            </p>
            <h1 className="mt-4 font-serif text-5xl font-light leading-[1.03] tracking-[-0.015em] md:text-6xl lg:text-7xl">
              {model.name}
            </h1>
          </FadeIn>
        </Container>
      </section>

      {gallery.length > 0 ? (
        <section className="py-12 md:py-16">
          <Container>
            <FadeIn>
              <ScrollScaleImage
                src={gallery[0]}
                alt={`${model.name} — portfolio image 1`}
                sizes="(max-width: 1280px) 100vw, 80rem"
                priority
                className="aspect-[4/5] w-full md:aspect-[16/10]"
              />
            </FadeIn>

            {gallery.length > 1 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {gallery.slice(1).map((url, index) => (
                  <FadeIn key={url} delay={index * 80}>
                    <div className="skeleton relative aspect-[3/4] overflow-hidden bg-ink/5">
                      <Image
                        fill
                        src={url}
                        alt={`${model.name} — portfolio image ${index + 2}`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder="blur"
                        blurDataURL={blurPlaceholder}
                        className="object-cover"
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      <section className="border-t border-ink/10 py-16 md:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
            <FadeIn>
              {model.bio ? (
                <p className="max-w-xl text-sm leading-relaxed text-ink/70">
                  {model.bio}
                </p>
              ) : (
                <p className="max-w-xl text-sm leading-relaxed text-ink/50">
                  For booking inquiries and full portfolio packages, get in
                  touch below.
                </p>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button href={bookHref} size="lg">
                  Book this model
                </Button>
                {contactEmail ? (
                  <Button
                    href={mailHref(contactEmail, {
                      subject: `Booking inquiry: ${model.name}`,
                      body: `Hello, I would like to inquire about booking ${model.name}.`,
                    })}
                    variant="outline"
                    size="lg"
                  >
                    Email us
                  </Button>
                ) : null}
                {contactWhatsapp ? (
                  <Button
                    href={waHref(
                      contactWhatsapp,
                      `Hello, I would like to book ${model.name}.`
                    )}
                    variant="outline"
                    size="lg"
                  >
                    WhatsApp
                  </Button>
                ) : null}
              </div>
            </FadeIn>

            {stats.length > 0 ? (
              <FadeIn delay={120}>
                <h2 className="text-[11px] uppercase tracking-[0.35em] text-ink/50">
                  Statistics
                </h2>
                <dl className="mt-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.key}
                      className="flex items-baseline justify-between border-t border-ink/10 py-4 last:border-b"
                    >
                      <dt className="text-[11px] uppercase tracking-[0.25em] text-ink/50">
                        {stat.label}
                      </dt>
                      <dd className="font-serif text-xl font-light">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            ) : null}
          </div>
        </Container>
      </section>
    </div>
  );
}

export default function ModelDetailPage({
  params,
}: PageProps<"/models/[slug]">) {
  return (
    <Suspense fallback={<ModelDetailSkeleton />}>
      <ModelDetail params={params} />
    </Suspense>
  );
}
