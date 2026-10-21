import { redirect } from "next/navigation";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) {
    const { data: adminRow } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", data.claims.sub)
      .maybeSingle();
    if (adminRow) redirect("/admin");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-paper px-6 py-16">
      <div className="w-full max-w-sm">
        <div aria-hidden className="mb-6 h-px w-10 bg-gold" />
        <h1 className="font-serif text-4xl font-light leading-none">
          Welcome back
        </h1>
        <p className="mt-3 text-sm text-ink/50">
          Sign in to the administration dashboard.
        </p>
        <div className="mt-10">
          <AdminLoginPanel />
        </div>
      </div>
    </main>
  );
}
