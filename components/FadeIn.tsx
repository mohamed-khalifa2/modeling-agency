"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ElementType } from "react";
import { cn } from "@/lib/utils";

type FadeInTag =
  | "div"
  | "section"
  | "article"
  | "figure"
  | "header"
  | "footer"
  | "li"
  | "span";

type FadeInProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  as?: FadeInTag;
  delay?: number;
  duration?: number;
  y?: number;
  children?: React.ReactNode;
};

export function FadeIn({
  as: Tag = "div",
  delay = 0,
  duration = 800,
  y = 24,
  className,
  style,
  children,
  ...props
}: FadeInProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.fade = "visible";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.fade = "visible";
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      data-fade="hidden"
      className={cn(className)}
      style={
        {
          "--fade-delay": `${delay}ms`,
          "--fade-duration": `${duration}ms`,
          "--fade-y": `${y}px`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </Component>
  );
}
