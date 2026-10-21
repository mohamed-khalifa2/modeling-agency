"use client";

import { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import {
  createInquiry,
  type InquiryActionState,
} from "@/lib/actions/inquiries";
import { cn } from "@/lib/utils";

const initialState: InquiryActionState = { status: "idle" };

const inputClass =
  "w-full border-b border-ink/20 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-ink/30 focus:border-ink";

const labelClass = "block text-[10px] uppercase tracking-[0.3em] text-ink/50";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[11px] text-[#8a3a2a]">
      {message}
    </p>
  );
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(
    createInquiry,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const prefilledRef = useRef(false);

  useEffect(() => {
    const modelName = searchParams.get("modelName");
    const modelSlug = searchParams.get("model");
    if (
      modelName &&
      modelSlug &&
      !prefilledRef.current &&
      formRef.current
    ) {
      const message = formRef.current.elements.namedItem(
        "message"
      ) as HTMLTextAreaElement | null;
      if (message && !message.value) {
        message.value = `I would like to book ${modelName} for a project.`;
      }
      prefilledRef.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <div>
      {state.status === "success" && state.message ? (
        <p
          role="status"
          className="mb-8 border border-ink/10 bg-paper-soft/50 px-6 py-4 text-sm"
        >
          {state.message}
        </p>
      ) : null}

      {state.status === "error" && state.message ? (
        <p role="alert" className="mb-8 text-sm text-[#8a3a2a]">
          {state.message}
        </p>
      ) : null}

      <form ref={formRef} action={formAction} className="space-y-8" noValidate>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry-name" className={labelClass}>
              Name
            </label>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={Boolean(state.fieldErrors?.name)}
              aria-describedby={
                state.fieldErrors?.name ? "inquiry-name-error" : undefined
              }
              className={cn(
                inputClass,
                state.fieldErrors?.name && "border-[#8a3a2a]"
              )}
            />
            <FieldError
              id="inquiry-name-error"
              message={state.fieldErrors?.name}
            />
          </div>

          <div>
            <label htmlFor="inquiry-email" className={labelClass}>
              Email
            </label>
            <input
              id="inquiry-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(state.fieldErrors?.email)}
              aria-describedby={
                state.fieldErrors?.email ? "inquiry-email-error" : undefined
              }
              className={cn(
                inputClass,
                state.fieldErrors?.email && "border-[#8a3a2a]"
              )}
            />
            <FieldError
              id="inquiry-email-error"
              message={state.fieldErrors?.email}
            />
          </div>
        </div>

        <div>
          <label htmlFor="inquiry-phone" className={labelClass}>
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="inquiry-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            rows={4}
            required
            aria-invalid={Boolean(state.fieldErrors?.message)}
            aria-describedby={
              state.fieldErrors?.message ? "inquiry-message-error" : undefined
            }
            className={cn(
              inputClass,
              "resize-none",
              state.fieldErrors?.message && "border-[#8a3a2a]"
            )}
          />
          <FieldError
            id="inquiry-message-error"
            message={state.fieldErrors?.message}
          />
        </div>

        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="inquiry-company">Company</label>
          <input
            id="inquiry-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Sending…" : "Send inquiry"}
        </Button>
      </form>
    </div>
  );
}
