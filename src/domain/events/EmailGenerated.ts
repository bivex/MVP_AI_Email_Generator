import { UserId } from "../value-objects/UserId"
import { TemplateId } from "../value-objects/TemplateId"
import { EmailContent } from "../value-objects/EmailContent"

export class EmailGenerated {
  constructor(
    public readonly userId: UserId,
    public readonly templateId: TemplateId,
    public readonly content: EmailContent,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
