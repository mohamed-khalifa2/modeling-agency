import Link from "next/link";
import { ModelsTable } from "@/components/admin/ModelsTable";
import { primaryButtonClass } from "@/components/admin/styles";
import { createClient } from "@/lib/supabase/server";
import { modelCategoryLabels, type Model, type ModelCategory } from "@/types";

export const instant = false;

export default async function AdminModelsPage({
  searchParams,
}: PageProps<"/admin/models">) {
  const { q, category } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const categoryValue = typeof category === "string" ? category : "";

  const supabase = await createClient();

  let builder = supabase.from("models").select("*").order("sort_order");
  if (query) builder = builder.ilike("name", `%${query}%`);
  if (categoryValue && categoryValue in modelCategoryLabels) {
    builder = builder.eq("category", categoryValue as ModelCategory);
  }

  const { data } = await builder;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light">Models</h1>
          <p className="mt-1 text-sm text-black/50">
            The board: profiles, covers, and galleries.
          </p>
        </div>
        <Link href="/admin/models/new" className={primaryButtonClass}>
          New model
        </Link>
      </div>

      <ModelsTable
        models={(data as Model[]) ?? []}
        query={query}
        category={categoryValue}
      />
    </div>
  );
}
