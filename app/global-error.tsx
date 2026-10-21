"use client";

import { useEffect } from "react";
import Link from "next/link";

const paper = "#f5f2ed";
const ink = "#0a0a0a";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: paper,
          color: ink,
          fontFamily: "Georgia, 'Times New Roman', serif",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(10,10,10,0.5)",
            }}
          >
            Error
          </p>
          <h1 style={{ fontSize: 56, fontWeight: 300, margin: "24px 0 0" }}>
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(10,10,10,0.6)",
              maxWidth: 420,
              margin: "20px auto 0",
            }}
          >
            An unexpected error occurred. Try again, or head back to the
            homepage.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                backgroundColor: ink,
                color: paper,
                border: "none",
                padding: "16px 36px",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                color: ink,
                border: "1px solid rgba(10,10,10,0.4)",
                padding: "16px 36px",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Back home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
