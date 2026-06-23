import { IUserRepository } from "../../../domain/repositories/IUserRepository"
import { User } from "../../../domain/entities/User"
import { UserId } from "../../../domain/value-objects/UserId"
import { getSupabaseClient } from "../../../lib/supabase"

export class SupabaseUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await getSupabaseClient()
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapToEntity(data)
  }

  async findById(id: UserId): Promise<User | null> {
    const { data, error } = await getSupabaseClient()
      .from("users")
      .select("*")
      .eq("id", id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return this.mapToEntity(data)
  }

  async save(user: User): Promise<void> {
    const { error } = await getSupabaseClient().from("users").insert({
      id: user.getId().getValue(),
      email: user.getEmail(),
      name: user.getName(),
      plan: user.getPlan(),
      created_at: user.getCreatedAt().toISOString(),
      updated_at: user.getUpdatedAt().toISOString(),
    })

    if (error) {
      throw new Error(`Failed to save user: ${error.message}`)
    }
  }

  async update(user: User): Promise<void> {
    const { error } = await getSupabaseClient()
      .from("users")
      .update({
        plan: user.getPlan(),
        updated_at: user.getUpdatedAt().toISOString(),
      })
      .eq("id", user.getId().getValue())

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }
  }

  private mapToEntity(data: Record<string, unknown>): User {
    return new User({
      id: new UserId(data.id as string),
      email: data.email as string,
      name: data.name as string,
      plan: data.plan as any,
      createdAt: new Date(data.created_at as string),
      updatedAt: new Date(data.updated_at as string),
    })
  }
}
