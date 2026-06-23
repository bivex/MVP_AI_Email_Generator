import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

/**
 * OAuth/email-confirmation callback.
 *
 * Supabase sends the user here after they click "Confirm email address" in the
 * signup email. The URL contains a `code` (PKCE flow). We exchange it for a
 * session: write the session cookies onto the response we return, then
 * redirect to the dashboard.
 *
 * This route MUST be in the middleware's public-paths allowlist, otherwise an
 * unauthenticated user hitting it would be bounced to /login before the code
 * can be exchanged.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/dashboard"

  // Build the final destination URL (origin, not the Supabase callback host).
  const redirectTo = new URL(next, origin)

  // Bind the Supabase client's setAll to OUR response cookies so the exchanged
  // session cookies actually get written to the browser.
  const response = NextResponse.redirect(redirectTo, { status: 302 })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error("[Auth Callback] exchangeCodeForSession failed:", error.message)
      // Send them to login with an error hint instead of a dead end.
      const loginUrl = new URL("/login?error=confirmation_failed", origin)
      return NextResponse.redirect(loginUrl, { status: 302 })
    }
  }

  return response
}
