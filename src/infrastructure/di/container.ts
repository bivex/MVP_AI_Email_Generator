import { IAIProvider } from "../../application/interfaces/IAIProvider"
import { IAuthService } from "../../application/interfaces/IAuthService"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { IEmailTemplateRepository } from "../../domain/repositories/IEmailTemplateRepository"
import { IGenerationRepository } from "../../domain/repositories/IGenerationRepository"
import { MockAIAdapter } from "../adapters/ai/MockAIAdapter"
import { OpenAIAdapter } from "../adapters/ai/OpenAIAdapter"
import { AnthropicAdapter } from "../adapters/ai/AnthropicAdapter"
import { GeminiAdapter } from "../adapters/ai/GeminiAdapter"
import { SupabaseAuthAdapter } from "../adapters/auth/SupabaseAuthAdapter"
import { SupabaseUserRepository } from "../adapters/repositories/SupabaseUserRepository"
import { SupabaseTemplateRepository } from "../adapters/repositories/SupabaseTemplateRepository"
import { SupabaseGenerationRepository } from "../adapters/repositories/SupabaseGenerationRepository"
import { AI_PROVIDER } from "../config/env"

class Container {
  private static instances: Map<string, unknown> = new Map()

  static getAIProvider(): IAIProvider {
    const key = "aiProvider"
    if (!this.instances.has(key)) {
      switch (AI_PROVIDER) {
        case "openai":
          this.instances.set(key, new OpenAIAdapter())
          break
        case "anthropic":
          this.instances.set(key, new AnthropicAdapter())
          break
        case "gemini":
          this.instances.set(key, new GeminiAdapter())
          break
        default:
          this.instances.set(key, new MockAIAdapter())
      }
    }
    return this.instances.get(key) as IAIProvider
  }

  static getAuthService(): IAuthService {
    const key = "authService"
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseAuthAdapter())
    }
    return this.instances.get(key) as IAuthService
  }

  static getUserRepository(): IUserRepository {
    const key = "userRepository"
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseUserRepository())
    }
    return this.instances.get(key) as IUserRepository
  }

  static getEmailTemplateRepository(): IEmailTemplateRepository {
    const key = "templateRepository"
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseTemplateRepository())
    }
    return this.instances.get(key) as IEmailTemplateRepository
  }

  static getGenerationRepository(): IGenerationRepository {
    const key = "generationRepository"
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseGenerationRepository())
    }
    return this.instances.get(key) as IGenerationRepository
  }
}

export const container = Container
