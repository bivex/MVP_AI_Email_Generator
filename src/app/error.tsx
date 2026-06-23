"use client"

/**
 * Root error boundary — catches any runtime error thrown while rendering
 * a route segment. Replaces the default white screen with a friendly UI.
 * Must be a Client Component.
 *
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the error server-side too, so it shows up in the logs.
    console.error("[App Error Boundary]", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            An unexpected error occurred while loading this page. You can try
            again or go back to safety.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left text-xs bg-muted/50 p-3 rounded-md border">
            <summary className="cursor-pointer text-muted-foreground">
              Error details (dev only)
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-all text-destructive">
              {error.message}
              {error.digest ? `\n\nDigest: ${error.digest}` : ""}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
