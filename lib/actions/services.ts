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

const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: text,
  icon: text,
});

function nullable(value: string): string | null {
  return value === "" ? null : value;
}

function parseService(formData: FormData) {
  return serviceSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    icon: formData.get("icon") ?? "",
  });
}

export async function createService(
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseService(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { data: last } = await supabase
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("services").insert({
    title: parsed.data.title,
    description: nullable(parsed.data.description),
    icon: nullable(parsed.data.icon),
    sort_order: (last?.sort_order ?? 0) + 1,
  });

  if (error) {
    return errorState("Could not create the service. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Service created." };
}

export async function updateService(
  id: string,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseService(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("services")
    .update({
      title: parsed.data.title,
      description: nullable(parsed.data.description),
      icon: nullable(parsed.data.icon),
    })
    .eq("id", id);

  if (error) {
    return errorState("Could not save the service. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Service saved." };
}

export async function deleteService(id: string): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) {
    return errorState("Could not delete the service. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Service deleted." };
}

export async function setServiceVisibility(
  id: string,
  isVisible: boolean
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("services")
    .update({ is_visible: isVisible })
    .eq("id", id);

  if (error) {
    return errorState("Could not update visibility. Please try again.");
  }

  revalidatePath("/");
  return {
    status: "success",
    message: isVisible ? "Service is now visible." : "Service hidden.",
  };
}

export async function reorderServices(
  ids: string[]
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("services")
      .update({ sort_order: i + 1 })
      .eq("id", ids[i]);
    if (error) {
      return errorState("Could not save the new order.");
    }
  }

  revalidatePath("/");
  return { status: "success" };
}
