import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/auth-helpers-nextjs"

const publicPaths = ["/login", "/register", "/pricing", "/", "/auth/callback", "/api/auth/login", "/api/auth/register"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (publicPaths.includes(path)) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && path !== "/login" && path !== "/register") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}


