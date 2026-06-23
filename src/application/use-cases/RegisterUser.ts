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
    await this.userRepository.save(user)

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
