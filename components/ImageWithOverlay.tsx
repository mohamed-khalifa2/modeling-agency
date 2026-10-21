import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ImageOverlay = "none" | "subtle" | "strong";

type ImageWithOverlayProps = {
  src: string;
  alt: string;
  ratio?: string;
  overlay?: ImageOverlay;
  caption?: ReactNode;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

const overlays: Record<ImageOverlay, string> = {
  none: "bg-transparent",
  subtle: "bg-ink/10",
  strong: "bg-gradient-to-t from-ink/80 via-ink/20 to-transparent",
};

export function ImageWithOverlay({
  src,
  alt,
  ratio = "aspect-[4/5]",
  overlay = "subtle",
  caption,
  sizes = "100vw",
  priority = false,
  className,
  imageClassName,
}: ImageWithOverlayProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-ink/5",
        ratio,
        className
      )}
    >
      <Image
        fill
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105",
          imageClassName
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-700",
          overlays[overlay]
        )}
      />
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 p-6 text-paper md:p-8">
          {caption}
        </div>
      ) : null}
    </div>
  );
}
