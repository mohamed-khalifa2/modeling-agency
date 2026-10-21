import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Hero } from "@/types";

export async function getHero(): Promise<Hero | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("hero");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data } = await supabase.from("hero").select("*").limit(1).maybeSingle();

  return (data as Hero | null) ?? null;
}
