import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[80rem] px-6 sm:px-8 lg:px-12 xl:px-16",
        className
      )}
      {...props}
    />
  );
}
