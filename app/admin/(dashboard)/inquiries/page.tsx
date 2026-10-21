import { InquiryTable } from "@/components/admin/InquiryTable";
import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/types";

export const instant = false;

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-2xl font-light">Inquiries</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        Booking inquiries submitted through the contact form.
      </p>
      <InquiryTable inquiries={(data as Inquiry[]) ?? []} />
    </div>
  );
}
