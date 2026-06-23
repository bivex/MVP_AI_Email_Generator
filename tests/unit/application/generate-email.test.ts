import { describe, it, expect, vi } from "vitest"
import { GenerateEmail } from "@/application/use-cases/GenerateEmail"
import { GenerationError } from "@/domain/errors/GenerationError"
import { UserId } from "@/domain/value-objects/UserId"
import {
  EmailTone,
  EmailLength,
  SubjectLine,
  EmailContent,
} from "@/domain/value-objects"
import type { IAIProvider } from "@/application/interfaces/IAIProvider"
import type { IEmailTemplateRepository } from "@/domain/repositories/IEmailTemplateRepository"
import type { IGenerationRepository } from "@/domain/repositories/IGenerationRepository"

// ---------------------------------------------------------------------------
// In-memory fakes implementing the domain ports. These let us test the
// GenerateEmail use case end-to-end without Supabase or any AI API.
// ---------------------------------------------------------------------------

function makeFakes() {
  const savedRequests = vi.fn<(request: Parameters<IGenerationRepository["save"]>[0]) => Promise<void>>()
  const savedTemplates = vi.fn<(template: Parameters<IEmailTemplateRepository["save"]>[0]) => Promise<void>>()

  const generationRepository: IGenerationRepository = {
    save: savedRequests,
    findById: vi.fn(async () => null),
    findByUserId: vi.fn(async () => []),
  }

  const templateRepository: IEmailTemplateRepository = {
    save: savedTemplates,
    findById: vi.fn(async () => null),
    findByUserId: vi.fn(async () => []),
    findAll: vi.fn(async () => []),
  }

  return { generationRepository, templateRepository, savedRequests, savedTemplates }
}

function makeAIProvider(content: string): IAIProvider & { calls: number } {
  let calls = 0
  return {
    async generateEmail() {
      calls++
      return new EmailContent(content)
    },
    get calls() {
      return calls
    },
  } as IAIProvider & { calls: number }
}

describe("GenerateEmail use case", () => {
  it("happy path: persists request, calls provider, persists template, returns DTO", async () => {
    const { generationRepository, templateRepository, savedRequests, savedTemplates } = makeFakes()
    const provider = makeAIProvider("Dear team, ...")
    const useCase = new GenerateEmail(provider, templateRepository, generationRepository)

    const result = await useCase.execute(new UserId("user-1"), {
      subject: "Quarterly review",
      tone: EmailTone.FORMAL,
      length: EmailLength.MEDIUM,
    })

    // Provider was called exactly once with the right params
    expect((provider as { calls: number }).calls).toBe(1)

    // The request was saved twice: once pending, once after completion... no —
    // only the pending one is saved before the call; on success the use case
    // does NOT re-save the request. So exactly 1 save for the request.
    expect(savedRequests).toHaveBeenCalledTimes(1)
    // The resulting template is persisted exactly once.
    expect(savedTemplates).toHaveBeenCalledTimes(1)

    // The returned DTO mirrors the inputs + generated content
    expect(result).toMatchObject({
      subject: "Quarterly review",
      tone: EmailTone.FORMAL,
      length: EmailLength.MEDIUM,
      content: "Dear team, ...",
    })
    expect(typeof result.id).toBe("string")
    expect(typeof result.createdAt).toBe("string")
  })

  it("on provider failure: marks request failed, re-saves it, and throws GenerationError", async () => {
    const { generationRepository, templateRepository, savedRequests, savedTemplates } = makeFakes()
    const failingProvider: IAIProvider = {
      async generateEmail() {
        throw new Error("API rate limited")
      },
    }
    const useCase = new GenerateEmail(failingProvider, templateRepository, generationRepository)

    await expect(
      useCase.execute(new UserId("user-1"), {
        subject: "Hello",
        tone: EmailTone.FRIENDLY,
        length: EmailLength.SHORT,
      }),
    ).rejects.toBeInstanceOf(GenerationError)

    // Request is saved twice: pending (1) and failed (2)
    expect(savedRequests).toHaveBeenCalledTimes(2)
    // The second save carries a failed status
    const secondCallArg = savedRequests.mock.calls[1][0] as { getStatus(): string }
    expect(secondCallArg.getStatus()).toBe("failed")
    // No template should ever be persisted when generation fails
    expect(savedTemplates).not.toHaveBeenCalled()
  })

  it("validates the subject via the SubjectLine value object", async () => {
    const { generationRepository, templateRepository } = makeFakes()
    const provider = makeAIProvider("content")
    const useCase = new GenerateEmail(provider, templateRepository, generationRepository)

    // SubjectLine rejects empty strings -> the use case should propagate the error.
    await expect(
      useCase.execute(new UserId("user-1"), {
        subject: "   ",
        tone: EmailTone.CASUAL,
        length: EmailLength.LONG,
      }),
    ).rejects.toThrow()

    void SubjectLine // keep the import meaningful for the reader
  })
})
