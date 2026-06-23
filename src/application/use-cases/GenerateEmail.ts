import { EmailContent } from "../../domain/value-objects/EmailContent"
import { EmailLength } from "../../domain/value-objects/EmailLength"
import { EmailTone } from "../../domain/value-objects/EmailTone"
import { SubjectLine } from "../../domain/value-objects/SubjectLine"
import { EmailTemplate } from "../../domain/entities/EmailTemplate"
import { GenerationRequest } from "../../domain/entities/GenerationRequest"
import { TemplateId } from "../../domain/value-objects/TemplateId"
import { RequestId } from "../../domain/value-objects/RequestId"
import { UserId } from "../../domain/value-objects/UserId"
import { IAIProvider } from "../interfaces/IAIProvider"
import { IEmailTemplateRepository } from "../../domain/repositories/IEmailTemplateRepository"
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository"
import { GenerationError } from "../../domain/errors/GenerationError"
import { GenerateEmailDTO, EmailResultDTO } from "../dto/GenerateEmailDTO"

export class GenerateEmail {
  constructor(
    private readonly aiProvider: IAIProvider,
    private readonly templateRepository: IEmailTemplateRepository,
    private readonly generationRepository: IGenerationRepository,
  ) {}

  async execute(userId: UserId, dto: GenerateEmailDTO): Promise<EmailResultDTO> {
    const requestId = new RequestId(crypto.randomUUID())
    const subject = new SubjectLine(dto.subject)

    const request = new GenerationRequest({
      id: requestId,
      userId,
      subject,
      tone: dto.tone,
      length: dto.length,
    })

    await this.generationRepository.save(request)

    try {
      const content = await this.aiProvider.generateEmail({
        subject,
        tone: dto.tone,
        length: dto.length,
      })

      request.complete(content)

      const templateId = new TemplateId(crypto.randomUUID())
      const template = new EmailTemplate({
        id: templateId,
        userId,
        subject,
        tone: dto.tone,
        length: dto.length,
        content,
      })

      await this.templateRepository.save(template)

      return {
        id: templateId.getValue(),
        subject: subject.getValue(),
        tone: dto.tone,
        length: dto.length,
        content: content.getValue(),
        createdAt: new Date().toISOString(),
      }
    } catch (error) {
      request.markAsFailed()
      await this.generationRepository.save(request)
      throw new GenerationError(
        error instanceof Error ? error.message : "Unknown generation error",
      )
    }
  }
}
