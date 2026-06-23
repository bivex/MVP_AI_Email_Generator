import { RequestId } from "../value-objects/RequestId"
import { UserId } from "../value-objects/UserId"
import { EmailTone } from "../value-objects/EmailTone"
import { EmailLength } from "../value-objects/EmailLength"
import { EmailContent } from "../value-objects/EmailContent"
import { SubjectLine } from "../value-objects/SubjectLine"

export type GenerationStatus = "pending" | "completed" | "failed"

export class GenerationRequest {
  private readonly _id: RequestId
  private readonly _userId: UserId
  private _subject: SubjectLine
  private _tone: EmailTone
  private _length: EmailLength
  private _status: GenerationStatus
  private _result: EmailContent | null
  private readonly _createdAt: Date
  private _completedAt: Date | null

  constructor({
    id,
    userId,
    subject,
    tone,
    length,
    status = "pending",
    result = null,
    createdAt = new Date(),
    completedAt = null,
  }: {
    id: RequestId
    userId: UserId
    subject: SubjectLine
    tone: EmailTone
    length: EmailLength
    status?: GenerationStatus
    result?: EmailContent | null
    createdAt?: Date
    completedAt?: Date | null
  }) {
    this._id = id
    this._userId = userId
    this._subject = subject
    this._tone = tone
    this._length = length
    this._status = status
    this._result = result
    this._createdAt = createdAt
    this._completedAt = completedAt
  }

  getId(): RequestId {
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

  getStatus(): GenerationStatus {
    return this._status
  }

  getResult(): EmailContent | null {
    return this._result
  }

  getCreatedAt(): Date {
    return this._createdAt
  }

  getCompletedAt(): Date | null {
    return this._completedAt
  }

  complete(result: EmailContent): void {
    if (this._status === "completed") {
      throw new Error("Request is already completed")
    }
    if (this._status === "failed") {
      throw new Error("Cannot complete a failed request")
    }
    this._result = result
    this._status = "completed"
    this._completedAt = new Date()
  }

  markAsFailed(): void {
    if (this._status === "completed") {
      throw new Error("Cannot mark completed request as failed")
    }
    this._status = "failed"
    this._completedAt = new Date()
  }

  equals(other: GenerationRequest): boolean {
    return this._id.equals(other._id)
  }
}
