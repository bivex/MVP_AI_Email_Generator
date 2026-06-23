import { NextResponse } from "next/server"
import { RegisterUser } from "@/application/use-cases/RegisterUser"
import { SupabaseAuthAdapter } from "@/infrastructure/adapters/auth/SupabaseAuthAdapter"
import { SupabaseUserRepository } from "@/infrastructure/adapters/repositories/SupabaseUserRepository"

const authService = new SupabaseAuthAdapter()
const userRepository = new SupabaseUserRepository()
const registerUser = new RegisterUser(authService, userRepository)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const result = await registerUser.execute({ name, email, password })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 400 }
    )
  }
}
