import { EmailContent } from "../../domain/value-objects/EmailContent"
import { EmailLength } from "../../domain/value-objects/EmailLength"
import { EmailTone } from "../../domain/value-objects/EmailTone"
import { SubjectLine } from "../../domain/value-objects/SubjectLine"

export interface IAIProvider {
  generateEmail(params: {
    subject: SubjectLine
    tone: EmailTone
    length: EmailLength
  }): Promise<EmailContent>
}
