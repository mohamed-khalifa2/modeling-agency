"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { blurPlaceholder } from "@/lib/images";
import { modelCategoryLabels, type Model, type ModelCategory } from "@/types";

type ModelGridProps = {
  models: Model[];
  showTabs?: boolean;
  disableLinks?: boolean;
  sizes?: string;
};

type FilterValue = "all" | ModelCategory;

export function ModelGrid({
  models,
  showTabs = true,
  disableLinks = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ModelGridProps) {
  const [active, setActive] = useState<FilterValue>("all");

  const presentCategories = Array.from(
    new Set(models.map((model) => model.category))
  );

  const filters: { value: FilterValue; label: string }[] = [
    { value: "all", label: "All" },
    ...presentCategories.map((category) => ({
      value: category as FilterValue,
      label: modelCategoryLabels[category],
    })),
  ];

  const visible =
    active === "all"
      ? models
      : models.filter((model) => model.category === active);

  return (
    <div>
      {showTabs && filters.length > 2 ? (
        <div
          className="flex flex-wrap items-center gap-x-8 gap-y-4"
          role="group"
          aria-label="Filter models by category"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active === filter.value}
              onClick={() => setActive(filter.value)}
              className={cn(
                "border-b pb-1 text-[11px] uppercase tracking-[0.25em] transition-colors",
                active === filter.value
                  ? "border-gold-deep text-gold-deep"
                  : "border-transparent text-ink/45 hover:text-ink"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      ) : null}

      {visible.length > 0 ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((model) => {
            const image = model.cover_image_url ? (
              <Image
                fill
                src={model.cover_image_url}
                alt={model.name}
                sizes={sizes}
                placeholder="blur"
                blurDataURL={blurPlaceholder}
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 group-focus-visible:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-paper-soft">
                <span className="font-serif text-3xl font-light text-ink/30">
                  {model.name}
                </span>
              </div>
            );

            const card = (
              <>
                <div className="skeleton relative aspect-[3/4] overflow-hidden bg-ink/5">
                  {image}
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent transition-opacity duration-500",
                      disableLinks
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-x-0 bottom-0 p-6 text-paper transition-all duration-500",
                      disableLinks
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                    )}
                  >
                    <p className="font-serif text-2xl font-light">
                      {model.name}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-paper/70">
                      {modelCategoryLabels[model.category]}
                    </p>
                  </div>
                </div>
              </>
            );

            return (
              <li key={model.id}>
                {disableLinks ? (
                  <div className="group block">{card}</div>
                ) : (
                  <Link
                    href={`/models/${model.slug}`}
                    className="group block rounded-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-deep"
                  >
                    {card}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-12 text-sm text-ink/60">
          No models in this category yet.
        </p>
      )}
    </div>
  );
}
