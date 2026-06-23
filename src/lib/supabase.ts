import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/auth-helpers-nextjs"
import type { NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Check if we are running in Next.js server context where next/headers is available
  try {
    const { cookies } = require("next/headers")
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        async getAll() {
          const cookieStore = await cookies()
          return cookieStore.getAll()
        },
        async setAll(cookiesToSet) {
          try {
            const cookieStore = await cookies()
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })
  } catch (error) {
    // Fallback to static client (client-side or when cookies() is not available)
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}

/**
 * Use this in API Route Handlers (POST, GET etc.) where we have access to NextRequest.
 * Reads cookies directly from the request object so auth session is available.
 */
export function getSupabaseClientForRequest(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {
        // No-op: cannot set cookies in route handler without NextResponse
      },
    },
  })
}


