import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClientForRequest } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClientForRequest(request)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return user data from the auth JWT directly — no DB query needed
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata as { name?: string })?.name ?? "",
        plan: "free",
        createdAt: user.created_at,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch profile" },
      { status: 500 }
    )
  }
}
