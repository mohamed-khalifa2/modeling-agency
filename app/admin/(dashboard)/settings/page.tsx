import { SettingsForm } from "@/components/admin/SettingsForm";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types";

export const instant = false;

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-light">Site Settings</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        Agency identity, contact details, social links, and SEO. Used in the
        header, footer, and contact section.
      </p>
      <SettingsForm settings={(data as SiteSettings | null) ?? null} />
    </div>
  );
}
