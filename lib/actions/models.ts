"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ModelImage } from "@/types";
import { slugify } from "@/lib/slug";
import {
  errorState,
  fieldErrorsFromZod,
  requireAdmin,
  type AdminActionState,
} from "./shared";

const text = z.string().trim();

const modelSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/, "Use lowercase letters, numbers, and hyphens."),
  category: z.enum(["women", "men", "new-faces", "kids"]),
  cover_image_url: text,
  bio: text,
  height: text,
  bust: text,
  waist: text,
  hips: text,
  shoes: text,
  hair: text,
  eyes: text,
  sort_order: z.coerce.number().int().min(0, "Sort order must be 0 or greater."),
  is_visible: z.boolean(),
});

function nullable(value: string): string | null {
  return value === "" ? null : value;
}

function parseModel(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  return modelSchema.safeParse({
    name,
    slug: slugInput || slugify(name),
    category: formData.get("category") ?? "women",
    cover_image_url: formData.get("cover_image_url") ?? "",
    bio: formData.get("bio") ?? "",
    height: formData.get("height") ?? "",
    bust: formData.get("bust") ?? "",
    waist: formData.get("waist") ?? "",
    hips: formData.get("hips") ?? "",
    shoes: formData.get("shoes") ?? "",
    hair: formData.get("hair") ?? "",
    eyes: formData.get("eyes") ?? "",
    sort_order: formData.get("sort_order") ?? 0,
    is_visible: formData.get("is_visible") === "on",
  });
}

export type ModelActionState = AdminActionState & {
  id?: string;
  image?: ModelImage;
};

export async function createModel(
  formData: FormData
): Promise<ModelActionState> {
  const parsed = parseModel(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { data, error } = await supabase
    .from("models")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      category: parsed.data.category,
      cover_image_url: nullable(parsed.data.cover_image_url),
      bio: nullable(parsed.data.bio),
      height: nullable(parsed.data.height),
      bust: nullable(parsed.data.bust),
      waist: nullable(parsed.data.waist),
      hips: nullable(parsed.data.hips),
      shoes: nullable(parsed.data.shoes),
      hair: nullable(parsed.data.hair),
      eyes: nullable(parsed.data.eyes),
      sort_order: parsed.data.sort_order,
      is_visible: parsed.data.is_visible,
    })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return {
        status: "error",
        fieldErrors: { slug: "A model with this slug already exists." },
      };
    }
    return errorState("Could not create the model. Please try again.");
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    message: "Model created.",
    id: String(data.id),
  };
}

export async function updateModel(
  id: string,
  formData: FormData
): Promise<ModelActionState> {
  const parsed = parseModel(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("models")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      category: parsed.data.category,
      cover_image_url: nullable(parsed.data.cover_image_url),
      bio: nullable(parsed.data.bio),
      height: nullable(parsed.data.height),
      bust: nullable(parsed.data.bust),
      waist: nullable(parsed.data.waist),
      hips: nullable(parsed.data.hips),
      shoes: nullable(parsed.data.shoes),
      hair: nullable(parsed.data.hair),
      eyes: nullable(parsed.data.eyes),
      sort_order: parsed.data.sort_order,
      is_visible: parsed.data.is_visible,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        fieldErrors: { slug: "A model with this slug already exists." },
      };
    }
    return errorState("Could not save the model. Please try again.");
  }

  revalidatePath("/", "layout");
  return { status: "success", message: "Model saved." };
}

export async function deleteModel(id: string): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase.from("models").delete().eq("id", id);
  if (error) {
    return errorState("Could not delete the model. Please try again.");
  }

  revalidatePath("/", "layout");
  return { status: "success", message: "Model deleted." };
}

export async function setModelVisibility(
  id: string,
  isVisible: boolean
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("models")
    .update({ is_visible: isVisible })
    .eq("id", id);

  if (error) {
    return errorState("Could not update visibility. Please try again.");
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    message: isVisible ? "Model is now visible." : "Model hidden.",
  };
}

export async function addModelImage(
  modelId: string,
  imageUrl: string
): Promise<ModelActionState> {
  if (!imageUrl.trim()) {
    return errorState("Upload an image first.");
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { data: last } = await supabase
    .from("model_images")
    .select("sort_order")
    .eq("model_id", modelId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("model_images")
    .insert({
      model_id: modelId,
      image_url: imageUrl.trim(),
      sort_order: (last?.sort_order ?? 0) + 1,
    })
    .select("*")
    .single();

  if (error || !data) {
    return errorState("Could not add the image. Please try again.");
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    message: "Image added.",
    image: data as ModelImage,
  };
}

export async function deleteModelImage(
  id: string
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("model_images")
    .delete()
    .eq("id", id);

  if (error) {
    return errorState("Could not delete the image. Please try again.");
  }

  revalidatePath("/", "layout");
  return { status: "success", message: "Image removed." };
}

export async function reorderModelImages(
  modelId: string,
  ids: string[]
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("model_images")
      .update({ sort_order: i + 1 })
      .eq("id", ids[i])
      .eq("model_id", modelId);
    if (error) {
      return errorState("Could not save the new order.");
    }
  }

  revalidatePath("/", "layout");
  return { status: "success" };
}
