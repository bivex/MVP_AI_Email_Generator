import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Performs the logout and returns a redirect response to /login.
 *
 * The key detail: we own the `NextResponse` (the redirect) and bind the
 * Supabase client's `setAll` to ITS cookies. That way `signOut()` — which
 * internally calls `setAll` to expire the session cookies — writes the
 * cleared cookies onto the very response we return. Without this, the cookies
 * wouldn't be deleted and middleware would bounce the user straight back.
 */
async function logoutAndRedirect(request: NextRequest, redirectStatus: number) {
  const redirectUrl = new URL("/login", request.url)
  const response = NextResponse.redirect(redirectUrl, { status: redirectStatus })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
  })

  // signOut() revokes the session server-side and clears the auth cookies.
  await supabase.auth.signOut()

  return response
}

/**
 * POST — used by the logout <form method="POST"> in the navbar.
 * Returns 303 (See Other) so the browser does a fresh GET to /login
 * (Post/Redirect/Get pattern — prevents form resubmission prompts).
 */
export async function POST(request: NextRequest) {
  try {
    return await logoutAndRedirect(request, 303)
  } catch (error) {
    console.error("[Logout] POST failed:", error)
    // Even if signOut throws, still redirect to /login so the user isn't stuck.
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 })
  }
}

/**
 * GET — supports visiting /api/auth/logout directly in the address bar.
 * Returns 307 to keep it a GET redirect.
 */
export async function GET(request: NextRequest) {
  try {
    return await logoutAndRedirect(request, 307)
  } catch (error) {
    console.error("[Logout] GET failed:", error)
    return NextResponse.redirect(new URL("/login", request.url), { status: 307 })
  }
}
