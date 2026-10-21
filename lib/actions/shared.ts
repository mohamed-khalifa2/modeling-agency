import { createClient } from "@/lib/supabase/server";

export type AdminActionState = {
  status: "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export function errorState(message: string): AdminActionState {
  return { status: "error", message };
}

export function fieldErrorsFromZod(error: {
  issues: { path: PropertyKey[]; message: string }[];
}): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function requireAdmin() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) {
    return {
      supabase,
      ok: false as const,
      message: "You must be signed in to do that.",
    };
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!adminRow) {
    return {
      supabase,
      ok: false as const,
      message: "You are not authorized to do that.",
    };
  }

  return { supabase, ok: true as const };
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
