import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Model, ModelCategory, ModelImage } from "@/types";

function createContentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getModels(options?: {
  category?: ModelCategory;
  limit?: number;
}): Promise<Model[] | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("models");

  const supabase = createContentClient();
  if (!supabase) return null;

  let query = supabase
    .from("models")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order");

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) return null;
  return (data as Model[]) ?? [];
}

export async function getModelDetail(
  slug: string
): Promise<{ model: Model; images: ModelImage[] } | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("models");

  const supabase = createContentClient();
  if (!supabase) return null;

  const { data: model } = await supabase
    .from("models")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();

  if (!model) {
    return null;
  }

  const { data: images } = await supabase
    .from("model_images")
    .select("*")
    .eq("model_id", (model as Model).id)
    .order("sort_order");

  return {
    model: model as Model,
    images: (images as ModelImage[]) ?? [],
  };
}

export async function getAllModelSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("models");

  const supabase = createContentClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("models")
    .select("slug")
    .eq("is_visible", true)
    .order("sort_order");

  return ((data as { slug: string }[]) ?? []).map((row) => row.slug);
}
