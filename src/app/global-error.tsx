"use client"

/**
 * global-error.tsx — the last-resort boundary.
 * It catches errors thrown in the ROOT layout itself (which error.tsx cannot,
 * because error.tsx is rendered *inside* the root layout). It must render its
 * own <html> and <body> tags.
 *
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/global-error
 */
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Global Error Boundary]", error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1.5rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(239,68,68,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
            aria-hidden
          >
            ⚠️
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Application Error
          </h1>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
            A critical error prevented the application from loading. Please try
            again.
          </p>

          {process.env.NODE_ENV === "development" && (
            <pre
              style={{
                textAlign: "left",
                fontSize: "0.75rem",
                backgroundColor: "rgba(255,255,255,0.06)",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                overflowX: "auto",
                color: "#fca5a5",
                marginBottom: "1.5rem",
              }}
            >
              {error.message}
              {error.digest ? `\n\nDigest: ${error.digest}` : ""}
            </pre>
          )}

          <button
            onClick={reset}
            style={{
              backgroundColor: "#fafafa",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
