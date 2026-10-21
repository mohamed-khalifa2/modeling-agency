"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  createService,
  deleteService,
  reorderServices,
  setServiceVisibility,
  updateService,
} from "@/lib/actions/services";
import type { Service } from "@/types";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Modal } from "@/components/admin/Modal";
import { SortableList } from "@/components/admin/SortableList";
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
import {
  FieldError,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  textActionClass,
  textareaClass,
} from "@/components/admin/styles";

function ServiceFormModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: Service | null;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const result = initial
      ? await updateService(initial.id, formData)
      : await createService(formData);

    setPending(false);

    if (result.status === "error") {
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      } else {
        toast.error(result.message ?? "Something went wrong.");
      }
      return;
    }

    toast.success(result.message ?? "Saved.");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit service" : "New service"}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="service-title" className={labelClass}>
            Title
          </label>
          <input
            id="service-title"
            name="title"
            type="text"
            defaultValue={initial?.title ?? ""}
            required
            className={inputClass}
          />
          <FieldError message={fieldErrors.title} />
        </div>

        <div>
          <label htmlFor="service-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="service-description"
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            className={textareaClass}
          />
        </div>

        <div>
          <label htmlFor="service-icon" className={labelClass}>
            Icon key <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="service-icon"
            name="icon"
            type="text"
            defaultValue={initial?.icon ?? ""}
            placeholder="camera, runway, calendar…"
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className={secondaryButtonClass}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className={primaryButtonClass}
          >
            {pending ? "Saving…" : "Save service"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function ServicesManager({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/50">
          Drag rows to set the order on the homepage.
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className={primaryButtonClass}
        >
          New service
        </button>
      </div>

      <SortableList
        items={services}
        onReorder={reorderServices}
        emptyMessage="No services yet. Create the first one."
        renderRow={(service) => (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{service.title}</p>
              <p className="mt-0.5 truncate text-xs text-black/40">
                {service.description ?? "No description"}
                {!service.is_visible ? " · Hidden" : ""}
              </p>
            </div>
            <VisibilityToggle
              checked={service.is_visible}
              label={service.title}
              onToggle={(next) => setServiceVisibility(service.id, next)}
            />
            <button
              type="button"
              onClick={() => setEditing(service)}
              className={textActionClass}
            >
              Edit
            </button>
            <DeleteButton
              label="Delete"
              title="Delete service?"
              description={`"${service.title}" will be permanently removed.`}
              onConfirm={() => deleteService(service.id)}
            />
          </>
        )}
      />

      <ServiceFormModal
        key="create"
        open={creating}
        initial={null}
        onClose={() => setCreating(false)}
      />
      <ServiceFormModal
        key={editing?.id ?? "edit"}
        open={editing !== null}
        initial={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
