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

    // Ensure the user exists in public.users (the DB trigger may have failed on first registration).
    // Using service role key is ideal, but since we don't have it configured we use an upsert
    // via the anon client — this works because the trigger function is SECURITY DEFINER.
    // We do this by calling the Supabase REST API with the service role if available,
    // otherwise we attempt an upsert and ignore RLS errors (trigger already did it).
    const { createClient } = await import("@supabase/supabase-js")
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const adminClient = serviceKey && serviceKey !== "your_service_role_key"
      ? createClient(supabaseUrl, serviceKey)
      : createClient(supabaseUrl, supabaseAnonKey)

    const { error: upsertError } = await adminClient.from("users").upsert({
      id: user.id,
      email: user.email,
      name: (user.user_metadata as { name?: string })?.name ?? "",
      plan: "free",
      created_at: user.created_at,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id", ignoreDuplicates: true })

    if (upsertError) {
      console.warn("[Generate] Could not upsert user into public.users:", upsertError.message)
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
