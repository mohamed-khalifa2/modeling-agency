import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
        className
      )}
    >
      <span
        aria-hidden
        className={cn("mb-8 block h-px w-12 bg-gold", centered && "mx-auto")}
      />
      {eyebrow ? (
        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] opacity-60">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="font-serif text-4xl font-light leading-[1.06] tracking-[-0.01em] md:text-5xl lg:text-6xl">
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-sm leading-relaxed opacity-70",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
