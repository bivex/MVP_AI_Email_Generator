import { User } from "../../domain/entities/User"
import { SubscriptionPlan } from "../../domain/value-objects/SubscriptionPlan"
import { UserId } from "../../domain/value-objects/UserId"
import { IUserRepository } from "../../domain/repositories/IUserRepository"

export class UpgradeSubscription {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: UserId): Promise<User> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }
    user.upgradeToPremium()
    await this.userRepository.update(user)
    return user
  }
}
