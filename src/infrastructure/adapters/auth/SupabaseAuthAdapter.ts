import { IAuthService } from "../../../application/interfaces/IAuthService"
import { User } from "../../../domain/entities/User"
import { UserId } from "../../../domain/value-objects/UserId"
import { getSupabaseClient } from "../../../lib/supabase"
import { APP_URL } from "../../../infrastructure/config/env"

export class SupabaseAuthAdapter implements IAuthService {
  async register(email: string, password: string, name: string): Promise<User> {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: { name },
        // Tells Supabase where to send the user after they click the
        // confirmation link in the email. Must be listed in Supabase's
        // "Redirect URLs" allowlist, otherwise Supabase falls back to Site URL.
        emailRedirectTo: `${APP_URL}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error("Registration failed")
    }

    return new User({
      id: new UserId(data.user.id),
      email: data.user.email!,
      name: name,
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(data.user.updated_at || data.user.created_at),
    })
  }

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error("Login failed")
    }

    return new User({
      id: new UserId(data.user.id),
      email: data.user.email!,
      name: (data.user.user_metadata as { name?: string })?.name || "",
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(data.user.updated_at || data.user.created_at),
    })
  }

  async logout(): Promise<void> {
    const { error } = await getSupabaseClient().auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await getSupabaseClient().auth.getUser()

    if (error || !data.user) {
      return null
    }

    return new User({
      id: new UserId(data.user.id),
      email: data.user.email!,
      name: (data.user.user_metadata as { name?: string })?.name || "",
      createdAt: new Date(data.user.created_at),
      updatedAt: new Date(data.user.updated_at || data.user.created_at),
    })
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email)
    if (error) {
      throw new Error(error.message)
    }
  }
}
