import { EmailLength } from "../../domain/value-objects/EmailLength"
import { EmailTone } from "../../domain/value-objects/EmailTone"
import { SubjectLine } from "../../domain/value-objects/SubjectLine"

export interface GenerateEmailDTO {
  subject: string
  tone: EmailTone
  length: EmailLength
}

export interface EmailResultDTO {
  id: string
  subject: string
  tone: string
  length: string
  content: string
  createdAt: string
}
