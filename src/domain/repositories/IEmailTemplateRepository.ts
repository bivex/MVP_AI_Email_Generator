import { EmailTemplate } from "../entities/EmailTemplate"
import { TemplateId } from "../value-objects/TemplateId"
import { UserId } from "../value-objects/UserId"

export interface IEmailTemplateRepository {
  findById(id: TemplateId): Promise<EmailTemplate | null>
  findByUserId(userId: UserId): Promise<EmailTemplate[]>
  save(template: EmailTemplate): Promise<void>
  findAll(): Promise<EmailTemplate[]>
}
