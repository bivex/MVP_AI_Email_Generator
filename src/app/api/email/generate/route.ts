import { NextRequest, NextResponse } from "next/server"
import { GenerateEmail } from "@/application/use-cases/GenerateEmail"
import { container } from "@/infrastructure/di/container"
import { EmailTone } from "@/domain/value-objects"
import { EmailLength } from "@/domain/value-objects"
import { getSupabaseClientForRequest } from "@/lib/supabase"
import { UserId } from "@/domain/value-objects/UserId"

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClientForRequest(request)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { subject, tone, length } = body

    if (!subject || !tone || !length) {
      return NextResponse.json(
        { error: "Subject, tone, and length are required" },
        { status: 400 }
      )
    }

    const userId = new UserId(user.id)

    const generateEmail = new GenerateEmail(
      container.getAIProvider(),
      container.getEmailTemplateRepository(),
      container.getGenerationRepository(),
    )

    const result = await generateEmail.execute(userId, {
      subject,
      tone: tone as EmailTone,
      length: length as EmailLength,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    )
  }
}
