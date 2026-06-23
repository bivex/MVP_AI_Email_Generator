import { describe, it, expect } from "vitest"
import { User } from "@/domain/entities/User"
import { EmailTemplate } from "@/domain/entities/EmailTemplate"
import { GenerationRequest } from "@/domain/entities/GenerationRequest"
import {
  UserId,
  TemplateId,
  RequestId,
  SubjectLine,
  EmailContent,
  EmailTone,
  EmailLength,
  SubscriptionPlan,
} from "@/domain/value-objects"

// ---------------------------------------------------------------------------
// Entities — state transitions and business rules.
// ---------------------------------------------------------------------------

describe("User", () => {
  function makeUser(plan: SubscriptionPlan = SubscriptionPlan.FREE) {
    return new User({
      id: new UserId("user-1"),
      email: "john@example.com",
      name: "John",
      plan,
    })
  }

  it("defaults to the free plan", () => {
    expect(makeUser().getPlan()).toBe(SubscriptionPlan.FREE)
  })

  it("upgradeToPremium moves free -> premium and bumps updatedAt", () => {
    const user = makeUser()
    const before = user.getUpdatedAt()
    // ensure updatedAt advances
    const original = new Date(before.getTime())
    user.upgradeToPremium()
    expect(user.getPlan()).toBe(SubscriptionPlan.PREMIUM)
    expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(original.getTime())
  })

  it("upgradeToPremium is idempotent-protected: second upgrade throws", () => {
    const user = makeUser(SubscriptionPlan.PREMIUM)
    expect(() => user.upgradeToPremium()).toThrow()
  })

  it("downgradeToFree moves premium -> free", () => {
    const user = makeUser(SubscriptionPlan.PREMIUM)
    user.downgradeToFree()
    expect(user.getPlan()).toBe(SubscriptionPlan.FREE)
  })

  it("downgradeToFree throws when already free", () => {
    expect(() => makeUser().downgradeToFree()).toThrow()
  })

  it("equals compares by id", () => {
    const a = makeUser()
    const b = new User({
      id: new UserId("user-1"),
      email: "other@example.com",
      name: "Other",
    })
    expect(a.equals(b)).toBe(true)
  })
})

describe("EmailTemplate", () => {
  it("stores and exposes all fields immutably", () => {
    const template = new EmailTemplate({
      id: new TemplateId("t-1"),
      userId: new UserId("u-1"),
      subject: new SubjectLine("Hello"),
      tone: EmailTone.FRIENDLY,
      length: EmailLength.MEDIUM,
      content: new EmailContent("Body"),
    })

    expect(template.getId().getValue()).toBe("t-1")
    expect(template.getUserId().getValue()).toBe("u-1")
    expect(template.getSubject().getValue()).toBe("Hello")
    expect(template.getTone()).toBe(EmailTone.FRIENDLY)
    expect(template.getLength()).toBe(EmailLength.MEDIUM)
    expect(template.getContent().getValue()).toBe("Body")
    expect(template.getCreatedAt()).toBeInstanceOf(Date)
  })

  it("equals compares by id", () => {
    const mk = (id: string) =>
      new EmailTemplate({
        id: new TemplateId(id),
        userId: new UserId("u-1"),
        subject: new SubjectLine("Hi"),
        tone: EmailTone.CASUAL,
        length: EmailLength.SHORT,
        content: new EmailContent("x"),
      })
    expect(mk("t-1").equals(mk("t-1"))).toBe(true)
    expect(mk("t-1").equals(mk("t-2"))).toBe(false)
  })
})

describe("GenerationRequest", () => {
  function makeRequest() {
    return new GenerationRequest({
      id: new RequestId("r-1"),
      userId: new UserId("u-1"),
      subject: new SubjectLine("Quote follow-up"),
      tone: EmailTone.FORMAL,
      length: EmailLength.MEDIUM,
    })
  }

  it("starts in pending status with no result", () => {
    const r = makeRequest()
    expect(r.getStatus()).toBe("pending")
    expect(r.getResult()).toBeNull()
    expect(r.getCompletedAt()).toBeNull()
  })

  it("complete() transitions pending -> completed and stores result", () => {
    const r = makeRequest()
    const content = new EmailContent("Done")
    r.complete(content)
    expect(r.getStatus()).toBe("completed")
    expect(r.getResult()?.getValue()).toBe("Done")
    expect(r.getCompletedAt()).toBeInstanceOf(Date)
  })

  it("complete() throws if already completed", () => {
    const r = makeRequest()
    r.complete(new EmailContent("Done"))
    expect(() => r.complete(new EmailContent("Again"))).toThrow()
  })

  it("complete() throws if the request already failed", () => {
    const r = makeRequest()
    r.markAsFailed()
    expect(() => r.complete(new EmailContent("Late"))).toThrow()
  })

  it("markAsFailed() transitions to failed and sets completedAt", () => {
    const r = makeRequest()
    r.markAsFailed()
    expect(r.getStatus()).toBe("failed")
    expect(r.getCompletedAt()).toBeInstanceOf(Date)
  })

  it("markAsFailed() throws if already completed", () => {
    const r = makeRequest()
    r.complete(new EmailContent("Done"))
    expect(() => r.markAsFailed()).toThrow()
  })
})
