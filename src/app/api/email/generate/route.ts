import { NextResponse } from "next/server"
import { GenerateEmail } from "@/application/use-cases/GenerateEmail"
import { container } from "@/infrastructure/di/container"
import { EmailTone } from "@/domain/value-objects"
import { EmailLength } from "@/domain/value-objects"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subject, tone, length } = body

    if (!subject || !tone || !length) {
      return NextResponse.json(
        { error: "Subject, tone, and length are required" },
        { status: 400 }
      )
    }

    const userId = { getValue: () => "demo-user" } as any

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
