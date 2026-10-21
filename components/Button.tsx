import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "outline" | "text";
export type ButtonTone = "dark" | "light";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "type"> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  href?: string;
  showArrow?: boolean;
  className?: string;
  children?: ReactNode;
};

const base =
  "group inline-flex items-center justify-center rounded-none font-sans uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

const variantTone: Record<ButtonVariant, Record<ButtonTone, string>> = {
  solid: {
    dark: "bg-ink text-paper hover:bg-ink-soft focus-visible:ring-ink focus-visible:ring-offset-paper",
    light:
      "bg-paper text-ink hover:bg-white focus-visible:ring-paper focus-visible:ring-offset-ink",
  },
  outline: {
    dark: "border border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-paper focus-visible:ring-ink focus-visible:ring-offset-paper",
    light:
      "border border-paper/40 text-paper hover:border-paper hover:bg-paper hover:text-ink focus-visible:ring-paper focus-visible:ring-offset-ink",
  },
  text: {
    dark: "border-b border-ink/30 text-ink transition-colors hover:border-gold-deep hover:text-gold-deep focus-visible:ring-ink focus-visible:ring-offset-paper",
    light:
      "border-b border-paper/30 text-paper hover:border-gold hover:text-gold focus-visible:ring-paper focus-visible:ring-offset-ink",
  },
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-5 text-[10px] tracking-[0.18em]",
  md: "h-11 px-7 text-[11px] tracking-[0.2em]",
  lg: "h-14 px-9 text-xs tracking-[0.22em]",
};

const textLinkSize: Record<ButtonSize, string> = {
  sm: "h-auto gap-2 px-0 pb-1 text-[10px] tracking-[0.18em]",
  md: "h-auto gap-2 px-0 pb-1 text-[11px] tracking-[0.2em]",
  lg: "h-auto gap-3 px-0 pb-1 text-xs tracking-[0.22em]",
};

function classes(variant: ButtonVariant, tone: ButtonTone, size: ButtonSize, className?: string) {
  return cn(
    base,
    variantTone[variant][tone],
    "transition-colors duration-300",
    variant === "text" ? textLinkSize[size] : sizes[size],
    className
  );
}

export function Button({
  variant = "solid",
  tone = "dark",
  size = "md",
  type = "button",
  href,
  showArrow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const arrow = showArrow ? (
    <span
      aria-hidden
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  ) : null;

  if (href) {
    const isExternal = href.startsWith("http");
    const linkClass = classes(variant, tone, size, className);

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {children}
          {arrow}
        </a>
      );
    }

    return (
      <Link href={href} className={linkClass}>
        {children}
        {arrow}
      </Link>
    );
  }

  return (
    <button type={type} className={classes(variant, tone, size, className)} {...props}>
      {children}
      {arrow}
    </button>
  );
}
