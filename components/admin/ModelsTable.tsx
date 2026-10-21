"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { deleteModel, setModelVisibility } from "@/lib/actions/models";
import { blurPlaceholder } from "@/lib/images";
import { modelCategoryLabels, type Model, type ModelCategory } from "@/types";
import { Skeleton } from "@/components/Skeleton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
import {
  inputClass,
  secondaryButtonClass,
  selectClass,
  textActionClass,
} from "@/components/admin/styles";

type ModelsTableProps = {
  models: Model[];
  query: string;
  category: string;
};

const categoryOptions = Object.keys(modelCategoryLabels) as ModelCategory[];

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-black/10 px-4 py-3 last:border-b-0">
      <Skeleton className="h-16 w-12 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56 max-w-full" />
      </div>
    </div>
  );
}

export function ModelsTable({ models, query, category }: ModelsTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function applyParams(next: { q?: string; category?: string }) {
    const params = new URLSearchParams();
    const q = next.q ?? query;
    const cat = next.category ?? category;
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    const qs = params.toString();

    startTransition(() => {
      router.replace(qs ? `/admin/models?${qs}` : "/admin/models");
    });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    applyParams({ q: String(formData.get("q") ?? "").trim() });
  }

  return (
    <div>
      <form
        onSubmit={handleSearch}
        className="mb-4 flex flex-wrap items-center gap-3"
      >
        <input
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search by name…"
          aria-label="Search models"
          className={`${inputClass} w-auto min-w-56`}
        />
        <button type="submit" disabled={pending} className={secondaryButtonClass}>
          Search
        </button>
        <select
          aria-label="Filter by category"
          value={category}
          disabled={pending}
          onChange={(event) => applyParams({ category: event.target.value })}
          className={`${selectClass} w-auto`}
        >
          <option value="">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {modelCategoryLabels[option]}
            </option>
          ))}
        </select>
      </form>

      <div aria-busy={pending}>
        {pending ? (
          <div className="border border-black/10 bg-white">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : models.length === 0 ? (
          <div className="border border-black/10 bg-white px-6 py-10 text-center text-sm text-black/40">
            No models match. Adjust the filters or create a new model.
          </div>
        ) : (
          <div className="border border-black/10 bg-white">
            {models.map((model) => (
              <div
                key={model.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-black/10 px-4 py-3 last:border-b-0 sm:flex-nowrap"
              >
                <div className="skeleton relative h-16 w-12 shrink-0 border border-black/10 bg-black/5">
                  {model.cover_image_url ? (
                    <Image
                      src={model.cover_image_url}
                      alt=""
                      fill
                      sizes="48px"
                      placeholder="blur"
                      blurDataURL={blurPlaceholder}
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/models/${model.id}`}
                    className="block truncate text-sm font-medium hover:underline focus-visible:underline"
                  >
                    {model.name}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-black/40">
                    {modelCategoryLabels[model.category]} · /{model.slug}
                    {!model.is_visible ? " · Hidden" : ""}
                  </p>
                </div>

                <div className="flex w-full items-center justify-end gap-4 sm:w-auto">
                  <VisibilityToggle
                    checked={model.is_visible}
                    label={model.name}
                    onToggle={(next) => setModelVisibility(model.id, next)}
                  />
                  <Link
                    href={`/admin/models/${model.id}`}
                    className={textActionClass}
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    label="Delete"
                    title="Delete model?"
                    description={`"${model.name}" and their gallery will be permanently removed.`}
                    onConfirm={() => deleteModel(model.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
