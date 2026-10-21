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

const sectionSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Key is required.")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens."),
  title: z.string().trim().min(1, "Title is required."),
  subtitle: text,
  description: text,
  image_url: text,
  layout: z.enum(["image-left", "image-right", "full-bleed"]),
});

function nullable(value: string): string | null {
  return value === "" ? null : value;
}

function parseSection(formData: FormData) {
  return sectionSchema.safeParse({
    key: formData.get("key") ?? "",
    title: formData.get("title") ?? "",
    subtitle: formData.get("subtitle") ?? "",
    description: formData.get("description") ?? "",
    image_url: formData.get("image_url") ?? "",
    layout: formData.get("layout") ?? "image-left",
  });
}

export async function createSection(
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseSection(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { data: last } = await supabase
    .from("sections")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("sections").insert({
    key: parsed.data.key,
    title: parsed.data.title,
    subtitle: nullable(parsed.data.subtitle),
    description: nullable(parsed.data.description),
    image_url: nullable(parsed.data.image_url),
    layout: parsed.data.layout,
    sort_order: (last?.sort_order ?? 0) + 1,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        fieldErrors: { key: "A section with this key already exists." },
      };
    }
    return errorState("Could not create the section. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Section created." };
}

export async function updateSection(
  id: string,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseSection(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("sections")
    .update({
      key: parsed.data.key,
      title: parsed.data.title,
      subtitle: nullable(parsed.data.subtitle),
      description: nullable(parsed.data.description),
      image_url: nullable(parsed.data.image_url),
      layout: parsed.data.layout,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        fieldErrors: { key: "A section with this key already exists." },
      };
    }
    return errorState("Could not save the section. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Section saved." };
}

export async function deleteSection(id: string): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) {
    return errorState("Could not delete the section. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Section deleted." };
}

export async function setSectionVisibility(
  id: string,
  isVisible: boolean
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("sections")
    .update({ is_visible: isVisible })
    .eq("id", id);

  if (error) {
    return errorState("Could not update visibility. Please try again.");
  }

  revalidatePath("/");
  return {
    status: "success",
    message: isVisible ? "Section is now visible." : "Section hidden.",
  };
}

export async function reorderSections(
  ids: string[]
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("sections")
      .update({ sort_order: i + 1 })
      .eq("id", ids[i]);
    if (error) {
      return errorState("Could not save the new order.");
    }
  }

  revalidatePath("/");
  return { status: "success" };
}
