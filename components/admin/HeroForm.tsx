"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { updateHero } from "@/lib/actions/hero";
import type { Hero } from "@/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  FieldError,
  inputClass,
  labelClass,
  primaryButtonClass,
  textareaClass,
} from "@/components/admin/styles";

export function HeroForm({ hero }: { hero: Hero | null }) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [imageUrl, setImageUrl] = useState(hero?.background_image_url ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    formData.set("background_image_url", imageUrl);

    const result = await updateHero(formData);
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
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" noValidate>
      <div>
        <label htmlFor="headline" className={labelClass}>
          Headline
        </label>
        <input
          id="headline"
          name="headline"
          type="text"
          defaultValue={hero?.headline ?? ""}
          required
          className={inputClass}
        />
        <FieldError message={fieldErrors.headline} />
      </div>

      <div>
        <label htmlFor="subheadline" className={labelClass}>
          Subheadline
        </label>
        <textarea
          id="subheadline"
          name="subheadline"
          rows={3}
          defaultValue={hero?.subheadline ?? ""}
          className={textareaClass}
        />
      </div>

      <input type="hidden" name="background_image_url" value={imageUrl} />
      <ImageUploader
        value={imageUrl || null}
        onChange={(url) => setImageUrl(url ?? "")}
        folder="hero"
        label="Background image"
        hint="Recommended 1920×1080 or larger. JPG, PNG, or WebP — max 5 MB."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cta_label" className={labelClass}>
            Primary CTA label
          </label>
          <input
            id="cta_label"
            name="cta_label"
            type="text"
            defaultValue={hero?.cta_label ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cta_link" className={labelClass}>
            Primary CTA link
          </label>
          <input
            id="cta_link"
            name="cta_link"
            type="text"
            defaultValue={hero?.cta_link ?? ""}
            placeholder="/models"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="secondary_cta_label" className={labelClass}>
            Secondary CTA label
          </label>
          <input
            id="secondary_cta_label"
            name="secondary_cta_label"
            type="text"
            defaultValue={hero?.secondary_cta_label ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="secondary_cta_link" className={labelClass}>
            Secondary CTA link
          </label>
          <input
            id="secondary_cta_link"
            name="secondary_cta_link"
            type="text"
            defaultValue={hero?.secondary_cta_link ?? ""}
            placeholder="/#contact"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className={primaryButtonClass}
        >
          {pending ? "Saving…" : "Save hero"}
        </button>
      </div>
    </form>
  );
}
