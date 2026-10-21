"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  addModelImage,
  deleteModelImage,
  reorderModelImages,
} from "@/lib/actions/models";
import { blurPlaceholder } from "@/lib/images";
import type { ModelImage } from "@/types";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SortableList } from "@/components/admin/SortableList";

type ModelGalleryProps = {
  modelId: string;
  images: ModelImage[];
};

export function ModelGallery({ modelId, images: initialImages }: ModelGalleryProps) {
  const [images, setImages] = useState(initialImages);
  const key = initialImages.map((image) => image.id).join("|");
  const [prevKey, setPrevKey] = useState(key);

  if (prevKey !== key) {
    setPrevKey(key);
    setImages(initialImages);
  }

  async function handleAdd(url: string) {
    const result = await addModelImage(modelId, url);
    if (result.status === "error" || !result.image) {
      toast.error(result.message ?? "Could not add the image.");
      return;
    }
    setImages((prev) => [...prev, result.image as ModelImage]);
    toast.success(result.message ?? "Image added.");
  }

  return (
    <div className="space-y-6">
      <ImageUploader
        value={null}
        onChange={(url) => {
          if (url) void handleAdd(url);
        }}
        folder={`models/${modelId}`}
        label="Add gallery image"
        hint="Uploaded images are appended to the end of the gallery. Drag to reorder below."
      />

      {images.length > 0 ? (
        <SortableList
          items={images}
          onReorder={(ids) => reorderModelImages(modelId, ids)}
          emptyMessage="No gallery images yet."
          renderRow={(image) => (
            <>
              <div className="skeleton relative h-20 w-16 shrink-0 border border-black/10 bg-black/5">
                <Image
                  src={image.image_url}
                  alt=""
                  fill
                  sizes="64px"
                  placeholder="blur"
                  blurDataURL={blurPlaceholder}
                  className="object-cover"
                />
              </div>
              <p className="min-w-0 flex-1 truncate text-xs text-black/40">
                {image.image_url}
              </p>
              <DeleteButton
                label="Remove"
                title="Remove image?"
                description="This image will be removed from the gallery."
                onConfirm={async () => {
                  const result = await deleteModelImage(image.id);
                  if (result.status === "success") {
                    setImages((prev) =>
                      prev.filter((item) => item.id !== image.id)
                    );
                  }
                  return result;
                }}
              />
            </>
          )}
        />
      ) : (
        <p className="text-sm text-black/40">No gallery images yet.</p>
      )}
    </div>
  );
}
