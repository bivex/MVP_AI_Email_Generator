import { EmailTemplate } from "../../domain/entities/EmailTemplate"
import { UserId } from "../../domain/value-objects/UserId"
import { IEmailTemplateRepository } from "../../domain/repositories/IEmailTemplateRepository"
import { EmailResultDTO } from "../dto/GenerateEmailDTO"

export class GetUserTemplates {
  constructor(private readonly templateRepository: IEmailTemplateRepository) {}

  async execute(userId: UserId): Promise<EmailResultDTO[]> {
    const templates = await this.templateRepository.findByUserId(userId)

    return templates.map((template: EmailTemplate) => ({
      id: template.getId().getValue(),
      subject: template.getSubject().getValue(),
      tone: template.getTone(),
      length: template.getLength(),
      content: template.getContent().getValue(),
      createdAt: template.getCreatedAt().toISOString(),
    }))
  }
}
