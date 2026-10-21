"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { AdminActionState } from "@/lib/actions/shared";
import { Modal } from "@/components/admin/Modal";
import {
  dangerButtonClass,
  secondaryButtonClass,
  textDangerActionClass,
} from "@/components/admin/styles";

type DeleteButtonProps = {
  label?: string;
  title?: string;
  description?: string;
  onConfirm: () => Promise<AdminActionState>;
};

export function DeleteButton({
  label = "Delete",
  title = "Delete item?",
  description = "This cannot be undone.",
  onConfirm,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    const result = await onConfirm();
    setPending(false);

    if (result.status === "error") {
      toast.error(result.message ?? "Could not delete.");
      return;
    }

    toast.success(result.message ?? "Deleted.");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={textDangerActionClass}
      >
        {label}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <p className="text-sm text-black/60">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={pending}
            className={secondaryButtonClass}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              void handleConfirm();
            }}
            disabled={pending}
            className={dangerButtonClass}
          >
            {pending ? "Deleting…" : label}
          </button>
        </div>
      </Modal>
    </>
  );
}
