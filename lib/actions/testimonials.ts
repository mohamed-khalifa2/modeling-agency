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

const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  quote: text,
  logo_url: text,
});

function nullable(value: string): string | null {
  return value === "" ? null : value;
}

function parseTestimonial(formData: FormData) {
  return testimonialSchema.safeParse({
    name: formData.get("name") ?? "",
    quote: formData.get("quote") ?? "",
    logo_url: formData.get("logo_url") ?? "",
  });
}

export async function createTestimonial(
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseTestimonial(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { data: last } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("testimonials").insert({
    name: parsed.data.name,
    quote: nullable(parsed.data.quote),
    logo_url: nullable(parsed.data.logo_url),
    sort_order: (last?.sort_order ?? 0) + 1,
  });

  if (error) {
    return errorState("Could not create the client. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Client created." };
}

export async function updateTestimonial(
  id: string,
  formData: FormData
): Promise<AdminActionState> {
  const parsed = parseTestimonial(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("testimonials")
    .update({
      name: parsed.data.name,
      quote: nullable(parsed.data.quote),
      logo_url: nullable(parsed.data.logo_url),
    })
    .eq("id", id);

  if (error) {
    return errorState("Could not save the client. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Client saved." };
}

export async function deleteTestimonial(
  id: string
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);
  if (error) {
    return errorState("Could not delete the client. Please try again.");
  }

  revalidatePath("/");
  return { status: "success", message: "Client deleted." };
}

export async function setTestimonialVisibility(
  id: string,
  isVisible: boolean
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("testimonials")
    .update({ is_visible: isVisible })
    .eq("id", id);

  if (error) {
    return errorState("Could not update visibility. Please try again.");
  }

  revalidatePath("/");
  return {
    status: "success",
    message: isVisible ? "Client is now visible." : "Client hidden.",
  };
}

export async function reorderTestimonials(
  ids: string[]
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("testimonials")
      .update({ sort_order: i + 1 })
      .eq("id", ids[i]);
    if (error) {
      return errorState("Could not save the new order.");
    }
  }

  revalidatePath("/");
  return { status: "success" };
}
