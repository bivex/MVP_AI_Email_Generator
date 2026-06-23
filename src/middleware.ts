import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

const publicPaths = ["/login", "/register", "/pricing", "/", "/api/auth/login", "/api/auth/register"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const response = NextResponse.next()

  if (publicPaths.includes(path)) {
    return response
  }

  const supabase = createMiddlewareClient({ req: request, res: response })
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

