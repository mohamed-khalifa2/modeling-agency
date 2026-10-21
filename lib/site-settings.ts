import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { SiteSettings } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-settings");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (data as SiteSettings | null) ?? null;
}

export async function getCopyrightYear(): Promise<number> {
  "use cache";
  cacheLife("hours");

  return new Date().getFullYear();
}
