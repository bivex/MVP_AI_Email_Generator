import { Loader2 } from "lucide-react"

/**
 * Default loading UI for the app router. Shown while route segments are
 * streaming/loading, instead of a blank screen.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  )
}
