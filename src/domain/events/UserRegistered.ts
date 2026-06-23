import { UserId } from "../value-objects/UserId"

export class UserRegistered {
  constructor(
    public readonly userId: UserId,
    public readonly email: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
