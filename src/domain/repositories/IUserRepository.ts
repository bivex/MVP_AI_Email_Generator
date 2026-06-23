import { User } from "../entities/User"
import { UserId } from "../value-objects/UserId"

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: UserId): Promise<User | null>
  save(user: User): Promise<void>
  update(user: User): Promise<void>
}
