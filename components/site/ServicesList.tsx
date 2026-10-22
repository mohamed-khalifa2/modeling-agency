import { FadeIn } from "@/components/FadeIn";
import { DEFAULT_SERVICES } from "@/lib/defaults";
import { getServices } from "@/lib/services";

export async function ServicesList() {
  const services = (await getServices()) ?? DEFAULT_SERVICES;

  if (services.length === 0) {
    return null;
  }

  return (
    <ul>
      {services.map((service, index) => (
        <FadeIn
          key={service.id}
          as="li"
          delay={index * 80}
          className="border-t border-ink/10 last:border-b"
        >
          <div className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-deep md:col-span-1">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-serif text-2xl font-light md:col-span-4 md:text-3xl">
              {service.title}
            </h3>
            {service.description ? (
              <p className="max-w-2xl text-sm leading-relaxed text-ink/70 md:col-span-7">
                {service.description}
              </p>
            ) : null}
          </div>
        </FadeIn>
      ))}
    </ul>
  );
}
