"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-32">
      <Container className="text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-ink/50">
          Error
        </p>
        <h1 className="mt-6 font-serif text-6xl font-light leading-none tracking-[-0.015em] md:text-7xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/60">
          An unexpected error occurred. Try again, or head back to the
          homepage.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button type="button" onClick={reset} size="lg">
            Try again
          </Button>
          <Button href="/" variant="outline" size="lg">
            Back home
          </Button>
        </div>
      </Container>
    </main>
  );
}
