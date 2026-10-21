"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteInquiry, setInquiryRead } from "@/lib/actions/inquiries";
import type { Inquiry } from "@/types";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Modal } from "@/components/admin/Modal";
import { textActionClass } from "@/components/admin/styles";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function InquiryDetails({
  inquiry,
  onMarkRead,
}: {
  inquiry: Inquiry;
  onMarkRead: (isRead: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="text-base font-medium">{inquiry.name}</p>
        <p className="text-sm text-black/50">
          <a
            href={`mailto:${inquiry.email}`}
            className="underline decoration-black/20 underline-offset-2 hover:decoration-black"
          >
            {inquiry.email}
          </a>
          {inquiry.phone ? ` · ${inquiry.phone}` : ""}
        </p>
        <p className="text-xs text-black/40">
          <span suppressHydrationWarning>
            {dateFormatter.format(new Date(inquiry.created_at))}
          </span>
        </p>
      </div>

      <div className="border-t border-black/10 pt-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-black/70">
          {inquiry.message}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-black/10 pt-4">
        <button
          type="button"
          onClick={() => onMarkRead(!inquiry.is_read)}
          className="inline-flex h-9 items-center border border-black/15 bg-white px-4 text-xs uppercase tracking-wider text-black/60 transition-colors hover:border-black/40 hover:text-black"
        >
          {inquiry.is_read ? "Mark as unread" : "Mark as read"}
        </button>
        <DeleteButton
          label="Delete"
          title="Delete inquiry?"
          description="This inquiry will be permanently removed."
          onConfirm={() => deleteInquiry(inquiry.id)}
        />
      </div>
    </div>
  );
}

export function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [items, setItems] = useState(inquiries);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const viewing = items.find((item) => item.id === viewingId) ?? null;

  function updateItem(id: string, patch: Partial<Inquiry>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  async function toggleRead(inquiry: Inquiry, isRead: boolean) {
    updateItem(inquiry.id, { is_read: isRead });
    const result = await setInquiryRead(inquiry.id, isRead);
    if (result.status === "error") {
      updateItem(inquiry.id, { is_read: !isRead });
      toast.error(result.message ?? "Could not update the inquiry.");
    } else {
      toast.success(result.message ?? "Updated.");
    }
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (viewingId === id) setViewingId(null);
  }

  if (items.length === 0) {
    return (
      <div className="border border-black/10 bg-white px-6 py-10 text-center text-sm text-black/40">
        No inquiries yet.
      </div>
    );
  }

  return (
    <div>
      <div className="border border-black/10 bg-white">
        <div className="hidden border-b border-black/10 px-4 py-2.5 text-[10px] uppercase tracking-wider text-black/40 sm:flex sm:items-center sm:gap-4">
          <span className="w-12 shrink-0">Status</span>
          <span className="min-w-0 flex-1">Name</span>
          <span className="hidden w-56 shrink-0 md:block">Email</span>
          <span className="hidden w-40 shrink-0 lg:block">Received</span>
          <span className="w-44 shrink-0 text-right">Actions</span>
        </div>

        {items.map((inquiry) => (
          <div
            key={inquiry.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-black/10 px-4 py-3 last:border-b-0 sm:flex-nowrap"
          >
            <span className="flex w-12 shrink-0 items-center gap-1.5 text-xs text-black/50">
              {!inquiry.is_read ? (
                <>
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[#8a3a2a]"
                  />
                  New
                </>
              ) : (
                "Read"
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span
                className={
                  inquiry.is_read
                    ? "block truncate text-sm text-black/70"
                    : "block truncate text-sm font-medium"
                }
              >
                {inquiry.name}
              </span>
              <span className="block truncate text-xs text-black/40 md:hidden">
                {inquiry.email}
              </span>
            </span>

            <span className="hidden w-56 shrink-0 truncate text-sm text-black/50 md:block">
              {inquiry.email}
            </span>
            <span
              className="hidden w-40 shrink-0 text-xs text-black/40 lg:block"
              suppressHydrationWarning
            >
              {dateFormatter.format(new Date(inquiry.created_at))}
            </span>

            <span className="flex w-44 shrink-0 items-center justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setViewingId(inquiry.id)}
                className={textActionClass}
              >
                View
              </button>
              <button
                type="button"
                onClick={() => {
                  void toggleRead(inquiry, !inquiry.is_read);
                }}
                className={textActionClass}
              >
                {inquiry.is_read ? "Unread" : "Mark read"}
              </button>
              <DeleteButton
                label="Delete"
                title="Delete inquiry?"
                description="This inquiry will be permanently removed."
                onConfirm={async () => {
                  const result = await deleteInquiry(inquiry.id);
                  if (result.status === "success") {
                    handleDelete(inquiry.id);
                  }
                  return result;
                }}
              />
            </span>
          </div>
        ))}
      </div>

      <Modal
        open={viewing !== null}
        onClose={() => setViewingId(null)}
        title="Inquiry"
      >
        {viewing ? (
          <InquiryDetails
            inquiry={viewing}
            onMarkRead={(isRead) => {
              void toggleRead(viewing, isRead);
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}
