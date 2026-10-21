"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { blurPlaceholder } from "@/lib/images";
import { cn } from "@/lib/utils";

type ScrollScaleImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function ScrollScaleImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: ScrollScaleImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = img.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport + rect.height))
      );
      img.style.transform = `scale(${1 + progress * 0.06})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={cn("skeleton relative overflow-hidden bg-ink/5", className)}
    >
      <Image
        ref={imgRef}
        fill
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurPlaceholder}
        className="object-cover will-change-transform"
      />
    </div>
  );
}
