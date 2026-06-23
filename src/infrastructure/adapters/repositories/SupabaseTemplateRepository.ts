import { IEmailTemplateRepository } from "../../../domain/repositories/IEmailTemplateRepository"
import { EmailTemplate } from "../../../domain/entities/EmailTemplate"
import { TemplateId } from "../../../domain/value-objects/TemplateId"
import { UserId } from "../../../domain/value-objects/UserId"
import { EmailTone } from "../../../domain/value-objects/EmailTone"
import { EmailLength } from "../../../domain/value-objects/EmailLength"
import { EmailContent } from "../../../domain/value-objects/EmailContent"
import { SubjectLine } from "../../../domain/value-objects/SubjectLine"
import { getSupabaseClient } from "../../../lib/supabase"

export class SupabaseTemplateRepository implements IEmailTemplateRepository {
  async findById(id: TemplateId): Promise<EmailTemplate | null> {
    const { data, error } = await getSupabaseClient()
      .from("email_templates")
      .select("*")
      .eq("id", id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return this.mapToEntity(data)
  }

  async findByUserId(userId: UserId): Promise<EmailTemplate[]> {
    const { data, error } = await getSupabaseClient()
      .from("email_templates")
      .select("*")
      .eq("user_id", userId.getValue())
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((item: Record<string, unknown>) => this.mapToEntity(item))
  }

  async save(template: EmailTemplate): Promise<void> {
    const { error } = await getSupabaseClient().from("email_templates").insert({
      id: template.getId().getValue(),
      user_id: template.getUserId().getValue(),
      subject: template.getSubject().getValue(),
      tone: template.getTone(),
      length: template.getLength(),
      content: template.getContent().getValue(),
      created_at: template.getCreatedAt().toISOString(),
    })

    if (error) {
      throw new Error(`Failed to save template: ${error.message}`)
    }
  }

  async findAll(): Promise<EmailTemplate[]> {
    const { data, error } = await getSupabaseClient()
      .from("email_templates")
      .select("*")
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((item: Record<string, unknown>) => this.mapToEntity(item))
  }

  private mapToEntity(data: Record<string, unknown>): EmailTemplate {
    return new EmailTemplate({
      id: new TemplateId(data.id as string),
      userId: new UserId(data.user_id as string),
      subject: new SubjectLine(data.subject as string),
      tone: data.tone as EmailTone,
      length: data.length as EmailLength,
      content: new EmailContent(data.content as string),
      createdAt: new Date(data.created_at as string),
    })
  }
}
