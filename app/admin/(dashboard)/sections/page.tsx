import { SectionsManager } from "@/components/admin/SectionsManager";
import { createClient } from "@/lib/supabase/server";
import type { Section } from "@/types";

export const instant = false;

export default async function AdminSectionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-light">Sections</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        Homepage editorial sections between the hero and featured models.
      </p>
      <SectionsManager sections={(data as Section[]) ?? []} />
    </div>
  );
}
