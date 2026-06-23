import { TemplateId } from "../value-objects/TemplateId"
import { UserId } from "../value-objects/UserId"
import { EmailTone } from "../value-objects/EmailTone"
import { EmailLength } from "../value-objects/EmailLength"
import { EmailContent } from "../value-objects/EmailContent"
import { SubjectLine } from "../value-objects/SubjectLine"

export class EmailTemplate {
  private readonly _id: TemplateId
  private readonly _userId: UserId
  private _subject: SubjectLine
  private _tone: EmailTone
  private _length: EmailLength
  private _content: EmailContent
  private readonly _createdAt: Date

  constructor({
    id,
    userId,
    subject,
    tone,
    length,
    content,
    createdAt = new Date(),
  }: {
    id: TemplateId
    userId: UserId
    subject: SubjectLine
    tone: EmailTone
    length: EmailLength
    content: EmailContent
    createdAt?: Date
  }) {
    this._id = id
    this._userId = userId
    this._subject = subject
    this._tone = tone
    this._length = length
    this._content = content
    this._createdAt = createdAt
  }

  getId(): TemplateId {
    return this._id
  }

  getUserId(): UserId {
    return this._userId
  }

  getSubject(): SubjectLine {
    return this._subject
  }

  getTone(): EmailTone {
    return this._tone
  }

  getLength(): EmailLength {
    return this._length
  }

  getContent(): EmailContent {
    return this._content
  }

  getCreatedAt(): Date {
    return this._createdAt
  }

  equals(other: EmailTemplate): boolean {
    return this._id.equals(other._id)
  }
}
