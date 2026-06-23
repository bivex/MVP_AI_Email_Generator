import { UserId } from "../value-objects/UserId"
import { SubscriptionPlan } from "../value-objects/SubscriptionPlan"

export class User {
  private readonly _id: UserId
  private _email: string
  private _name: string
  private _plan: SubscriptionPlan
  private _createdAt: Date
  private _updatedAt: Date

  constructor({
    id,
    email,
    name,
    plan = SubscriptionPlan.FREE,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: {
    id: UserId
    email: string
    name: string
    plan?: SubscriptionPlan
    createdAt?: Date
    updatedAt?: Date
  }) {
    this._id = id
    this._email = email
    this._name = name
    this._plan = plan
    this._createdAt = createdAt
    this._updatedAt = updatedAt
  }

  getId(): UserId {
    return this._id
  }

  getEmail(): string {
    return this._email
  }

  getName(): string {
    return this._name
  }

  getPlan(): SubscriptionPlan {
    return this._plan
  }

  getCreatedAt(): Date {
    return this._createdAt
  }

  getUpdatedAt(): Date {
    return this._updatedAt
  }

  upgradeToPremium(): void {
    if (this._plan === SubscriptionPlan.PREMIUM) {
      throw new Error("User is already on premium plan")
    }
    this._plan = SubscriptionPlan.PREMIUM
    this._updatedAt = new Date()
  }

  downgradeToFree(): void {
    if (this._plan === SubscriptionPlan.FREE) {
      throw new Error("User is already on free plan")
    }
    this._plan = SubscriptionPlan.FREE
    this._updatedAt = new Date()
  }

  equals(other: User): boolean {
    return this._id.equals(other._id)
  }
}
