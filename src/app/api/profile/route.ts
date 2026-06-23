import { NextResponse } from "next/server"
import { GetUserProfile } from "@/application/use-cases/GetUserProfile"
import { SupabaseUserRepository } from "@/infrastructure/adapters/repositories/SupabaseUserRepository"
import { getSupabaseClient } from "@/lib/supabase"
import { UserId } from "@/domain/value-objects/UserId"

const userRepository = new SupabaseUserRepository()
const getUserProfile = new GetUserProfile(userRepository)

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = new UserId(user.id)
    const result = await getUserProfile.execute(userId)
    return NextResponse.json({ user: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 }
    )
  }
}
