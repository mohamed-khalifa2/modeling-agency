"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  errorState,
  requireAdmin,
  type AdminActionState,
} from "./shared";

const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
  phone: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters)."),
  company: z.string(),
});

export type InquiryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function createInquiry(
  _prevState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return {
      status: "success",
      message: "Thank you — we'll be in touch shortly.",
    };
  }

  const parsed = inquirySchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    message: formData.get("message") ?? "",
    company: "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return {
      status: "error",
      message: "Something went wrong while sending your message. Please try again.",
    };
  }

  return {
    status: "success",
    message: "Thank you — we'll be in touch shortly.",
  };
}

export async function setInquiryRead(
  id: string,
  isRead: boolean
): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase
    .from("inquiries")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) {
    return errorState("Could not update the inquiry. Please try again.");
  }

  revalidatePath("/admin/inquiries");
  return {
    status: "success",
    message: isRead ? "Marked as read." : "Marked as unread.",
  };
}

export async function deleteInquiry(id: string): Promise<AdminActionState> {
  const { supabase, ok, message } = await requireAdmin();
  if (!ok) return errorState(message);

  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) {
    return errorState("Could not delete the inquiry. Please try again.");
  }

  revalidatePath("/admin/inquiries");
  return { status: "success", message: "Inquiry deleted." };
}
