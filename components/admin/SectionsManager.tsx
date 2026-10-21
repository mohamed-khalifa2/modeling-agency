"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  createSection,
  deleteSection,
  reorderSections,
  setSectionVisibility,
  updateSection,
} from "@/lib/actions/sections";
import type { Section, SectionLayout } from "@/types";
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
  selectClass,
  textActionClass,
  textareaClass,
} from "@/components/admin/styles";

const layoutLabels: Record<SectionLayout, string> = {
  "image-left": "Image left",
  "image-right": "Image right",
  "full-bleed": "Full bleed",
};

function SectionFormModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: Section | null;
}) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    formData.set("image_url", imageUrl);

    const result = initial
      ? await updateSection(initial.id, formData)
      : await createSection(formData);

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
      title={initial ? "Edit section" : "New section"}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="section-key" className={labelClass}>
            Key
          </label>
          <input
            id="section-key"
            name="key"
            type="text"
            defaultValue={initial?.key ?? ""}
            required
            className={inputClass}
          />
          <FieldError message={fieldErrors.key} />
        </div>

        <div>
          <label htmlFor="section-title" className={labelClass}>
            Title
          </label>
          <input
            id="section-title"
            name="title"
            type="text"
            defaultValue={initial?.title ?? ""}
            required
            className={inputClass}
          />
          <FieldError message={fieldErrors.title} />
        </div>

        <div>
          <label htmlFor="section-subtitle" className={labelClass}>
            Subtitle
          </label>
          <input
            id="section-subtitle"
            name="subtitle"
            type="text"
            defaultValue={initial?.subtitle ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="section-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="section-description"
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            className={textareaClass}
          />
        </div>

        <div>
          <label htmlFor="section-layout" className={labelClass}>
            Layout
          </label>
          <select
            id="section-layout"
            name="layout"
            defaultValue={initial?.layout ?? "image-left"}
            className={selectClass}
          >
            <option value="image-left">Image left</option>
            <option value="image-right">Image right</option>
            <option value="full-bleed">Full bleed</option>
          </select>
        </div>

        <input type="hidden" name="image_url" value={imageUrl} />
        <ImageUploader
          value={imageUrl || null}
          onChange={(url) => setImageUrl(url ?? "")}
          folder="sections"
          label="Section image"
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
            {pending ? "Saving…" : "Save section"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function SectionsManager({ sections }: { sections: Section[] }) {
  const [editing, setEditing] = useState<Section | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/50">
          Drag rows to set homepage order. Hidden sections are kept but not
          shown on the site.
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className={primaryButtonClass}
        >
          New section
        </button>
      </div>

      <SortableList
        items={sections}
        onReorder={reorderSections}
        emptyMessage="No sections yet. Create the first one."
        renderRow={(section) => (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{section.title}</p>
              <p className="mt-0.5 truncate text-xs text-black/40">
                {section.key} · {layoutLabels[section.layout]}
                {!section.is_visible ? " · Hidden" : ""}
              </p>
            </div>
            <VisibilityToggle
              checked={section.is_visible}
              label={section.title}
              onToggle={(next) => setSectionVisibility(section.id, next)}
            />
            <button
              type="button"
              onClick={() => setEditing(section)}
              className={textActionClass}
            >
              Edit
            </button>
            <DeleteButton
              label="Delete"
              title="Delete section?"
              description={`"${section.title}" will be permanently removed.`}
              onConfirm={() => deleteSection(section.id)}
            />
          </>
        )}
      />

      <SectionFormModal
        key="create"
        open={creating}
        initial={null}
        onClose={() => setCreating(false)}
      />
      <SectionFormModal
        key={editing?.id ?? "edit"}
        open={editing !== null}
        initial={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
