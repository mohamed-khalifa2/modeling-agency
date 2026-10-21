export const inputClass =
  "w-full border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/50";

export const textareaClass =
  "w-full resize-none border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/50";

export const selectClass =
  "w-full appearance-none border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black/50";

export const labelClass =
  "mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-black/50";

export const primaryButtonClass =
  "inline-flex h-9 items-center justify-center bg-black px-4 text-xs uppercase tracking-wider text-white transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-40";

export const secondaryButtonClass =
  "inline-flex h-9 items-center justify-center border border-black/15 bg-white px-4 text-xs uppercase tracking-wider text-black/60 transition-colors hover:border-black/40 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-40";

export const dangerButtonClass =
  "inline-flex h-9 items-center justify-center bg-[#8a3a2a] px-4 text-xs uppercase tracking-wider text-white transition-colors hover:bg-[#6e2e20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-40";

export const textActionClass =
  "text-xs text-black/40 transition-colors hover:text-black focus-visible:text-black focus-visible:underline focus-visible:underline-offset-4";

export const textDangerActionClass =
  "text-xs text-black/40 transition-colors hover:text-[#8a3a2a] focus-visible:text-[#8a3a2a] focus-visible:underline focus-visible:underline-offset-4";

export const fieldErrorClass = "mt-1 text-[11px] text-[#8a3a2a]";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={fieldErrorClass}>{message}</p>;
}
