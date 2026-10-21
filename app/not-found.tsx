import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-32">
      <Container className="text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-ink/50">
          Error 404
        </p>
        <h1 className="mt-6 font-serif text-6xl font-light leading-none tracking-[-0.015em] md:text-7xl lg:text-8xl">
          Page not found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/60">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back to the board.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/" size="lg">
            Back home
          </Button>
          <Button href="/models" variant="outline" size="lg">
            View the board
          </Button>
        </div>
      </Container>
    </main>
  );
}
