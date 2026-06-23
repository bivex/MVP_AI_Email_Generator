import { NextResponse } from "next/server"
import { AuthenticateUser } from "@/application/use-cases/AuthenticateUser"
import { SupabaseAuthAdapter } from "@/infrastructure/adapters/auth/SupabaseAuthAdapter"

const authService = new SupabaseAuthAdapter()
const authenticateUser = new AuthenticateUser(authService)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const result = await authenticateUser.execute({ email, password })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 401 }
    )
  }
}
