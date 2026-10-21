"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { blurPlaceholder } from "@/lib/images";
import { createClient } from "@/lib/supabase/client";
import { secondaryButtonClass } from "@/components/admin/styles";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type ImageUploaderProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  label?: string;
  hint?: string;
};

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
  hint = "JPG, PNG, or WebP — max 5 MB.",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(file: File | undefined) {
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES[file.type]) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("That image is larger than 5 MB. Please choose a smaller file.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const extension = ACCEPTED_TYPES[file.type];
      const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError("Upload failed. Please try again.");
        return;
      }

      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Image uploaded.");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-black/50">
        {label}
      </p>

      {value ? (
        <div className="mb-3 flex items-start gap-4">
          <div className="skeleton relative h-32 w-28 shrink-0 border border-black/10 bg-black/5">
            <Image
              src={value}
              alt=""
              fill
              sizes="112px"
              placeholder="blur"
              blurDataURL={blurPlaceholder}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className={secondaryButtonClass}
            >
              {busy ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setError(null);
              }}
              disabled={busy}
              className="text-left text-xs text-black/40 transition-colors hover:text-[#8a3a2a] focus-visible:text-[#8a3a2a] focus-visible:underline focus-visible:underline-offset-4"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`${secondaryButtonClass} ${busy ? "opacity-60" : ""}`}
        >
          {busy ? "Uploading…" : "Upload image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={Object.keys(ACCEPTED_TYPES).join(",")}
        className="sr-only"
        onChange={(event) => {
          void handleFileChange(event.target.files?.[0]);
        }}
      />

      {error ? <p className="mt-2 text-[11px] text-[#8a3a2a]">{error}</p> : null}
      {hint ? <p className="mt-2 text-[11px] text-black/40">{hint}</p> : null}
    </div>
  );
}
