import { NextResponse } from "next/server"
import { SupabaseAuthAdapter } from "@/infrastructure/adapters/auth/SupabaseAuthAdapter"

const authService = new SupabaseAuthAdapter()

export async function POST() {
  try {
    await authService.logout()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Logout failed" },
      { status: 400 }
    )
  }
}
