"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { createModel, updateModel } from "@/lib/actions/models";
import { slugify } from "@/lib/slug";
import { modelCategoryLabels, type Model, type ModelCategory } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  FieldError,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  selectClass,
  textareaClass,
} from "@/components/admin/styles";

const categories = Object.keys(modelCategoryLabels) as ModelCategory[];

const statFields = [
  { name: "height", label: "Height" },
  { name: "bust", label: "Bust" },
  { name: "waist", label: "Waist" },
  { name: "hips", label: "Hips" },
  { name: "shoes", label: "Shoes" },
  { name: "hair", label: "Hair" },
  { name: "eyes", label: "Eyes" },
] as const;

export function ModelForm({ model }: { model?: Model | null }) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [coverUrl, setCoverUrl] = useState(model?.cover_image_url ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    formData.set("cover_image_url", coverUrl);

    const result = model
      ? await updateModel(model.id, formData)
      : await createModel(formData);

    setPending(false);

    if (result.status === "error") {
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      } else {
        toast.error(result.message ?? "Something went wrong.");
      }
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/admin/models");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="model-name" className={labelClass}>
            Name
          </label>
          <input
            id="model-name"
            name="name"
            type="text"
            defaultValue={model?.name ?? ""}
            required
            className={inputClass}
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div>
          <label htmlFor="model-slug" className={labelClass}>
            Slug <span className="normal-case tracking-normal">(auto from name if empty)</span>
          </label>
          <input
            id="model-slug"
            name="slug"
            type="text"
            defaultValue={model?.slug ?? ""}
            placeholder="amara-osei"
            onBlur={(event) => {
              const nameInput = document.getElementById(
                "model-name"
              ) as HTMLInputElement | null;
              if (!event.target.value && nameInput?.value) {
                event.target.value = slugify(nameInput.value);
              }
            }}
            className={inputClass}
          />
          <FieldError message={fieldErrors.slug} />
        </div>

        <div>
          <label htmlFor="model-category" className={labelClass}>
            Category
          </label>
          <select
            id="model-category"
            name="category"
            defaultValue={model?.category ?? "women"}
            className={selectClass}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {modelCategoryLabels[category]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="model-sort_order" className={labelClass}>
            Sort order
          </label>
          <input
            id="model-sort_order"
            name="sort_order"
            type="number"
            min={0}
            defaultValue={model?.sort_order ?? 0}
            className={inputClass}
          />
          <FieldError message={fieldErrors.sort_order} />
        </div>
      </div>

      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <ImageUploader
        value={coverUrl || null}
        onChange={(url) => setCoverUrl(url ?? "")}
        folder="models"
        label="Cover image"
        hint="Portrait 4:5 works best. JPG, PNG, or WebP — max 5 MB."
      />

      <div>
        <label htmlFor="model-bio" className={labelClass}>
          Bio
        </label>
        <textarea
          id="model-bio"
          name="bio"
          rows={4}
          defaultValue={model?.bio ?? ""}
          className={textareaClass}
        />
      </div>

      <div>
        <p className={labelClass}>Stats</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={`model-${field.name}`} className="mb-1 block text-xs text-black/50">
                {field.label}
              </label>
              <input
                id={`model-${field.name}`}
                name={field.name}
                type="text"
                defaultValue={model?.[field.name] ?? ""}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_visible"
          defaultChecked={model?.is_visible ?? true}
          className="h-4 w-4 accent-black"
        />
        Visible on the site
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : model ? "Save model" : "Create model"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/models")}
          className={secondaryButtonClass}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
