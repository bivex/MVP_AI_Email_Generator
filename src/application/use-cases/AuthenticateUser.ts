import { User } from "../../domain/entities/User"
import { IAuthService } from "../interfaces/IAuthService"

export interface AuthenticateUserDTO {
  email: string
  password: string
}

export interface AuthenticateUserResult {
  user: {
    id: string
    email: string
    name: string
    plan: string
  }
}

export class AuthenticateUser {
  constructor(private readonly authService: IAuthService) {}

  async execute(dto: AuthenticateUserDTO): Promise<AuthenticateUserResult> {
    const user = await this.authService.login(dto.email, dto.password)

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
