import { RequestId } from "../value-objects/RequestId"
import { UserId } from "../value-objects/UserId"
import { EmailContent } from "../value-objects/EmailContent"

export class GenerationFailed {
  constructor(
    public readonly requestId: RequestId,
    public readonly userId: UserId,
    public readonly reason: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
