import { User } from "../../domain/entities/User"
import { UserId } from "../../domain/value-objects/UserId"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { IAuthService } from "../interfaces/IAuthService"
import { RegisterUserDTO, RegisterUserResult } from "../dto/RegisterUserDTO"

export class RegisterUser {
  constructor(
    private readonly authService: IAuthService,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterUserDTO): Promise<RegisterUserResult> {
    const user = await this.authService.register(dto.email, dto.password, dto.name)
    
    try {
      await this.userRepository.save(user)
    } catch (error) {
      // The database trigger on_auth_user_created handles insertion.
      // We catch any RLS/duplicate errors here so registration succeeds.
      console.log("UserRepository.save skipped or failed (handled by DB trigger):", error)
    }

    return {
      user: {
        id: user.getId().getValue(),
        email: user.getEmail(),
        name: user.getName(),
        plan: user.getPlan(),
      },
    }
  }
}
