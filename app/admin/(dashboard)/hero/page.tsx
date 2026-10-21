import { HeroForm } from "@/components/admin/HeroForm";
import { createClient } from "@/lib/supabase/server";
import type { Hero } from "@/types";

export const instant = false;

export default async function AdminHeroPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-light">Hero</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        The full-screen opening section of the homepage.
      </p>
      <HeroForm hero={(data as Hero | null) ?? null} />
    </div>
  );
}
