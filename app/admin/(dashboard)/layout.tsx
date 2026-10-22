import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSiteSettings } from "@/lib/site-settings";

const DEFAULT_AGENCY_NAME = "Lumina Model Management";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages read the auth session (Supabase internals call Date.now).
  // Stop prerendering here so the whole dashboard renders at request time.
  await connection();

  const settings = await getSiteSettings();

  return (
    <div className="min-h-svh bg-[#f6f6f5] text-ink">
      <AdminSidebar agencyName={settings?.agency_name ?? DEFAULT_AGENCY_NAME} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-8 lg:px-12 lg:pt-12">
          {children}
        </main>
      </div>
    </div>
  );
}
