"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  EMAIL_PATTERN,
  errorState,
  fieldErrorsFromZod,
  requireAdmin,
  type AdminActionState,
} from "./shared";

const text = z.string().trim();

const settingsSchema = z.object({
  agency_name: z.string().trim().min(1, "Agency name is required."),
  tagline: text,
  logo_url: text,
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || EMAIL_PATTERN.test(v), "Enter a valid email address."),
  phone: text,
  whatsapp: text,
  address: text,
  instagram: text,
  facebook: text,
  tiktok: text,
  footer_text: text,
  seo_title: text,
  seo_description: text,
});

function nullable(value: string): string | null {
  return value === "" ? null : value;
}

export async function updateSiteSettings(
  formData: FormData
): Promise<AdminActionState> {
  const parsed = settingsSchema.safeParse({
    agency_name: formData.get("agency_name") ?? "",
    tagline: formData.get("tagline") ?? "",
    logo_url: formData.get("logo_url") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    address: formData.get("address") ?? "",
    instagram: formData.get("instagram") ?? "",
    facebook: formData.get("facebook") ?? "",
    tiktok: formData.get("tiktok") ?? "",
    footer_text: formData.get("footer_text") ?? "",
    seo_title: formData.get("seo_title") ?? "",
    seo_description: formData.get("seo_description") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase.from("site_settings").upsert({
    id: true,
    agency_name: parsed.data.agency_name,
    tagline: nullable(parsed.data.tagline),
    logo_url: nullable(parsed.data.logo_url),
    email: nullable(parsed.data.email),
    phone: nullable(parsed.data.phone),
    whatsapp: nullable(parsed.data.whatsapp),
    address: nullable(parsed.data.address),
    instagram: nullable(parsed.data.instagram),
    facebook: nullable(parsed.data.facebook),
    tiktok: nullable(parsed.data.tiktok),
    footer_text: nullable(parsed.data.footer_text),
    seo_title: nullable(parsed.data.seo_title),
    seo_description: nullable(parsed.data.seo_description),
  });

  if (error) {
    return errorState("Could not save site settings. Please try again.");
  }

  revalidatePath("/", "layout");
  return { status: "success", message: "Site settings saved." };
}
