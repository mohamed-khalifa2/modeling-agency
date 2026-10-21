"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-b border-ink/20 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-ink/30 focus:border-ink";

const labelClass = "block text-[10px] uppercase tracking-[0.3em] text-ink/50";

export function AdminLoginPanel() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Invalid email or password.");
      setPending(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {error ? (
        <p
          id="admin-login-error"
          role="alert"
          className="border border-ink/10 bg-ink/5 px-5 py-3 text-sm text-ink/70"
        >
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor="admin-email" className={labelClass}>
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "admin-login-error" : undefined}
          className={cn(inputClass, error && "border-ink/60")}
        />
      </div>

      <div>
        <label htmlFor="admin-password" className={labelClass}>
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "admin-login-error" : undefined}
          className={cn(inputClass, error && "border-ink/60")}
        />
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
