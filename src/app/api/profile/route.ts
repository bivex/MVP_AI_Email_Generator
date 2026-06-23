import { NextResponse } from "next/server"
import { GetUserProfile } from "@/application/use-cases/GetUserProfile"
import { SupabaseUserRepository } from "@/infrastructure/adapters/repositories/SupabaseUserRepository"

const userRepository = new SupabaseUserRepository()
const getUserProfile = new GetUserProfile(userRepository)

export async function GET() {
  try {
    const userId = { getValue: () => "demo-user" } as any
    const result = await getUserProfile.execute(userId)
    return NextResponse.json({ user: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 }
    )
  }
}
