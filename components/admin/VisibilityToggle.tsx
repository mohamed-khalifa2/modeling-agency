"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { AdminActionState } from "@/lib/actions/shared";
import { cn } from "@/lib/utils";

type VisibilityToggleProps = {
  checked: boolean;
  label: string;
  onToggle: (next: boolean) => Promise<AdminActionState>;
};

export function VisibilityToggle({
  checked,
  label,
  onToggle,
}: VisibilityToggleProps) {
  const [value, setValue] = useState(checked);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    const next = !value;
    setValue(next);
    setPending(true);

    const result = await onToggle(next);
    setPending(false);

    if (result.status === "error") {
      setValue(!next);
      toast.error(result.message ?? "Could not update visibility.");
    } else {
      toast.success(result.message ?? "Visibility updated.");
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={`${label} — ${value ? "visible" : "hidden"}`}
      disabled={pending}
      onClick={() => {
        void handleClick();
      }}
      className={cn(
        "relative h-5 w-9 shrink-0 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50",
        value ? "border-black bg-black" : "border-black/20 bg-black/10"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-[2px] h-3.5 w-3.5 bg-white shadow-sm transition-transform duration-200",
          value ? "translate-x-[18px]" : "translate-x-[2px]"
        )}
      />
    </button>
  );
}
