import { ClientsManager } from "@/components/admin/ClientsManager";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types";

export const instant = false;

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-light">Clients</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        Client testimonials and logos shown in the homepage strip.
      </p>
      <ClientsManager clients={(data as Testimonial[]) ?? []} />
    </div>
  );
}
