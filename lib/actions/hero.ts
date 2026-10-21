"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  errorState,
  fieldErrorsFromZod,
  requireAdmin,
  type AdminActionState,
} from "./shared";

const text = z.string().trim();

const heroSchema = z.object({
  headline: z.string().trim().min(1, "Headline is required."),
  subheadline: text,
  background_image_url: text,
  cta_label: text,
  cta_link: text,
  secondary_cta_label: text,
  secondary_cta_link: text,
});

function nullable(value: string): string | null {
  return value === "" ? null : value;
}

export async function updateHero(
  formData: FormData
): Promise<AdminActionState> {
  const parsed = heroSchema.safeParse({
    headline: formData.get("headline") ?? "",
    subheadline: formData.get("subheadline") ?? "",
    background_image_url: formData.get("background_image_url") ?? "",
    cta_label: formData.get("cta_label") ?? "",
    cta_link: formData.get("cta_link") ?? "",
    secondary_cta_label: formData.get("secondary_cta_label") ?? "",
    secondary_cta_link: formData.get("secondary_cta_link") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase.from("hero").upsert({
    id: true,
    headline: parsed.data.headline,
    subheadline: nullable(parsed.data.subheadline),
    background_image_url: nullable(parsed.data.background_image_url),
    cta_label: nullable(parsed.data.cta_label),
    cta_link: nullable(parsed.data.cta_link),
    secondary_cta_label: nullable(parsed.data.secondary_cta_label),
    secondary_cta_link: nullable(parsed.data.secondary_cta_link),
  });

  if (error) {
    return errorState("Could not save the hero. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Hero saved." };
}
