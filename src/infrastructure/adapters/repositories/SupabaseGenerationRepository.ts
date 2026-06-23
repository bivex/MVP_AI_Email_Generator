import { IGenerationRepository } from "../../../domain/repositories/IGenerationRepository"
import { GenerationRequest } from "../../../domain/entities/GenerationRequest"
import { RequestId } from "../../../domain/value-objects/RequestId"
import { UserId } from "../../../domain/value-objects/UserId"
import { EmailTone } from "../../../domain/value-objects/EmailTone"
import { EmailLength } from "../../../domain/value-objects/EmailLength"
import { EmailContent } from "../../../domain/value-objects/EmailContent"
import { SubjectLine } from "../../../domain/value-objects/SubjectLine"
import { getSupabaseClient } from "../../../lib/supabase"

export class SupabaseGenerationRepository implements IGenerationRepository {
  async save(request: GenerationRequest): Promise<void> {
    const { error } = await getSupabaseClient()
      .from("generation_requests")
      .upsert({
        id: request.getId().getValue(),
        user_id: request.getUserId().getValue(),
        subject: request.getSubject().getValue(),
        tone: request.getTone(),
        length: request.getLength(),
        status: request.getStatus(),
        result: request.getResult()?.getValue() || null,
        created_at: request.getCreatedAt().toISOString(),
        completed_at: request.getCompletedAt()?.toISOString() || null,
      })

    if (error) {
      throw new Error(`Failed to save generation request: ${error.message}`)
    }
  }

  async findById(id: RequestId): Promise<GenerationRequest | null> {
    const { data, error } = await getSupabaseClient()
      .from("generation_requests")
      .select("*")
      .eq("id", id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return this.mapToEntity(data)
  }

  async findByUserId(userId: UserId): Promise<GenerationRequest[]> {
    const { data, error } = await getSupabaseClient()
      .from("generation_requests")
      .select("*")
      .eq("user_id", userId.getValue())
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((item: Record<string, unknown>) => this.mapToEntity(item))
  }

  private mapToEntity(data: Record<string, unknown>): GenerationRequest {
    return new GenerationRequest({
      id: new RequestId(data.id as string),
      userId: new UserId(data.user_id as string),
      subject: new SubjectLine(data.subject as string),
      tone: data.tone as EmailTone,
      length: data.length as EmailLength,
      status: data.status as any,
      result: data.result ? new EmailContent(data.result as string) : null,
      createdAt: new Date(data.created_at as string),
      completedAt: data.completed_at ? new Date(data.completed_at as string) : null,
    })
  }
}
