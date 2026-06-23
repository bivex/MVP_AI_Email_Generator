import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SupabaseAuthAdapter } from "@/infrastructure/adapters/auth/SupabaseAuthAdapter"

const authService = new SupabaseAuthAdapter()
const publicPaths = ["/login", "/register", "/pricing", "/", "/api/auth/login", "/api/auth/register"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  const user = await authService.getCurrentUser()

  if (!user && path !== "/login" && path !== "/register") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
