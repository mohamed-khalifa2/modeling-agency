"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  createTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  setTestimonialVisibility,
  updateTestimonial,
} from "@/lib/actions/testimonials";
import type { Testimonial } from "@/types";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ImageUploader } from "@/components/admin/ImageUploader";
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

function ClientFormModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: Testimonial | null;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    formData.set("logo_url", logoUrl);

    const result = initial
      ? await updateTestimonial(initial.id, formData)
      : await createTestimonial(formData);

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
      title={initial ? "Edit client" : "New client"}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="client-name" className={labelClass}>
            Name
          </label>
          <input
            id="client-name"
            name="name"
            type="text"
            defaultValue={initial?.name ?? ""}
            required
            className={inputClass}
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div>
          <label htmlFor="client-quote" className={labelClass}>
            Quote <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="client-quote"
            name="quote"
            rows={4}
            defaultValue={initial?.quote ?? ""}
            className={textareaClass}
          />
        </div>

        <input type="hidden" name="logo_url" value={logoUrl} />
        <ImageUploader
          value={logoUrl || null}
          onChange={(url) => setLogoUrl(url ?? "")}
          folder="clients"
          label="Logo"
          hint="Shown instead of a quote when no quote is set. JPG, PNG, or WebP — max 5 MB."
        />

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
            {pending ? "Saving…" : "Save client"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function ClientsManager({ clients }: { clients: Testimonial[] }) {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/50">
          Clients with a quote show the quote; others show the logo.
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className={primaryButtonClass}
        >
          New client
        </button>
      </div>

      <SortableList
        items={clients}
        onReorder={reorderTestimonials}
        emptyMessage="No clients yet. Create the first one."
        renderRow={(client) => (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{client.name}</p>
              <p className="mt-0.5 truncate text-xs text-black/40">
                {client.quote
                  ? `“${client.quote}”`
                  : client.logo_url
                    ? "Logo only"
                    : "Empty entry"}
                {!client.is_visible ? " · Hidden" : ""}
              </p>
            </div>
            <VisibilityToggle
              checked={client.is_visible}
              label={client.name}
              onToggle={(next) => setTestimonialVisibility(client.id, next)}
            />
            <button
              type="button"
              onClick={() => setEditing(client)}
              className={textActionClass}
            >
              Edit
            </button>
            <DeleteButton
              label="Delete"
              title="Delete client?"
              description={`"${client.name}" will be permanently removed.`}
              onConfirm={() => deleteTestimonial(client.id)}
            />
          </>
        )}
      />

      <ClientFormModal
        key="create"
        open={creating}
        initial={null}
        onClose={() => setCreating(false)}
      />
      <ClientFormModal
        key={editing?.id ?? "edit"}
        open={editing !== null}
        initial={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
