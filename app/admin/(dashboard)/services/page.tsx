import { ServicesManager } from "@/components/admin/ServicesManager";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/types";

export const instant = false;

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-light">Services</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        The services list shown on the homepage.
      </p>
      <ServicesManager services={(data as Service[]) ?? []} />
    </div>
  );
}
