"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { AdminActionState } from "@/lib/actions/shared";
import { cn } from "@/lib/utils";

type SortableListProps<T extends { id: string }> = {
  items: T[];
  onReorder: (ids: string[]) => Promise<AdminActionState>;
  renderRow: (item: T) => ReactNode;
  emptyMessage?: string;
};

function GripIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 16"
      className="h-4 w-3"
      fill="currentColor"
    >
      <circle cx="3" cy="3" r="1.25" />
      <circle cx="9" cy="3" r="1.25" />
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="9" cy="8" r="1.25" />
      <circle cx="3" cy="13" r="1.25" />
      <circle cx="9" cy="13" r="1.25" />
    </svg>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex items-stretch bg-white",
        isDragging && "relative z-10 opacity-80 shadow-sm"
      )}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="flex w-10 shrink-0 cursor-grab touch-none items-center justify-center border-r border-black/10 text-black/25 transition-colors hover:text-black active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripIcon />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
        {children}
      </div>
    </div>
  );
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderRow,
  emptyMessage = "Nothing here yet.",
}: SortableListProps<T>) {
  const [order, setOrder] = useState(items);
  const key = items.map((item) => item.id).join("|");
  const [prevKey, setPrevKey] = useState(key);

  if (prevKey !== key) {
    setPrevKey(key);
    setOrder(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.findIndex((item) => item.id === active.id);
    const newIndex = order.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(order, oldIndex, newIndex);
    setOrder(next);

    const result = await onReorder(next.map((item) => item.id));
    if (result.status === "error") {
      setOrder(order);
      toast.error(result.message ?? "Could not save the new order.");
    } else {
      toast.success("Order updated.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="border border-black/10 bg-white px-6 py-10 text-center text-sm text-black/40">
        {emptyMessage}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        void handleDragEnd(event);
      }}
    >
      <SortableContext
        items={order.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="divide-y divide-black/10 border border-black/10 bg-white">
          {order.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {renderRow(item)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
