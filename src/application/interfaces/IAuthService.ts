import { User } from "../../domain/entities/User"

export interface IAuthService {
  register(email: string, password: string, name: string): Promise<User>
  login(email: string, password: string): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  resetPassword(email: string): Promise<void>
}
