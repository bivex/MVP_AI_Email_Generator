import { User } from "../../domain/entities/User"
import { UserId } from "../../domain/value-objects/UserId"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { UserDTO } from "../dto/UserDTO"

export class GetUserProfile {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: UserId): Promise<UserDTO> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    return {
      id: user.getId().getValue(),
      email: user.getEmail(),
      name: user.getName(),
      plan: user.getPlan(),
      createdAt: user.getCreatedAt().toISOString(),
    }
  }
}
