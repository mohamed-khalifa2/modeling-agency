import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Section } from "@/types";

export async function getSections(): Promise<Section[] | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("sections");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");

  if (error) return null;
  return (data as Section[]) ?? [];
}
