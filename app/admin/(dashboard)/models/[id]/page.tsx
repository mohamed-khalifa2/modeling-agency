import { notFound } from "next/navigation";
import { ModelForm } from "@/components/admin/ModelForm";
import { ModelGallery } from "@/components/admin/ModelGallery";
import { createClient } from "@/lib/supabase/server";
import type { Model, ModelImage } from "@/types";

export const instant = false;

export default async function AdminEditModelPage({
  params,
}: PageProps<"/admin/models/[id]">) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: model } = await supabase
    .from("models")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!model) notFound();

  const { data: images } = await supabase
    .from("model_images")
    .select("*")
    .eq("model_id", id)
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-light">Edit model</h1>
      <p className="mb-8 mt-1 text-sm text-black/50">
        {model.name} — changes appear on the public site immediately.
      </p>

      <ModelForm model={model as Model} />

      <div className="mt-14 border-t border-black/10 pt-10">
        <h2 className="text-lg font-light">Gallery</h2>
        <p className="mb-6 mt-1 text-sm text-black/50">
          Portfolio images shown on the model&apos;s public page.
        </p>
        <ModelGallery
          modelId={id}
          images={(images as ModelImage[]) ?? []}
        />
      </div>
    </div>
  );
}
