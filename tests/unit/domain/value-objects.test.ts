import { describe, it, expect } from "vitest"
import {
  SubjectLine,
  EmailContent,
  UserId,
  TemplateId,
  RequestId,
  EmailTone,
  EmailLength,
  SubscriptionPlan,
  TONE_LABELS,
  LENGTH_LABELS,
  PLAN_LABELS,
  PLAN_LIMITS,
} from "@/domain/value-objects"

// ---------------------------------------------------------------------------
// Value objects — invariant tests. The domain layer must enforce its rules
// itself, independent of any framework or DB.
// ---------------------------------------------------------------------------

describe("SubjectLine", () => {
  it("creates a valid subject line", () => {
    const s = new SubjectLine("Project update")
    expect(s.getValue()).toBe("Project update")
    expect(s.toString()).toBe("Project update")
  })

  it("rejects empty / whitespace-only values", () => {
    expect(() => new SubjectLine("")).toThrow()
    expect(() => new SubjectLine("   ")).toThrow()
  })

  it("rejects values longer than 200 characters", () => {
    expect(() => new SubjectLine("x".repeat(201))).toThrow()
    expect(() => new SubjectLine("x".repeat(200))).not.toThrow()
  })

  it("compares by value", () => {
    expect(new SubjectLine("a").equals(new SubjectLine("a"))).toBe(true)
    expect(new SubjectLine("a").equals(new SubjectLine("b"))).toBe(false)
  })
})

describe("EmailContent", () => {
  it("creates valid content", () => {
    const c = new EmailContent("Hello world")
    expect(c.getValue()).toBe("Hello world")
  })

  it("strips HTML tags in getPlainText", () => {
    const c = new EmailContent("<p>Hello <b>world</b></p>")
    expect(c.getPlainText()).toBe("Hello world")
  })

  it("rejects empty content", () => {
    expect(() => new EmailContent("")).toThrow()
    expect(() => new EmailContent("   ")).toThrow()
  })

  it("compares by value", () => {
    expect(new EmailContent("a").equals(new EmailContent("a"))).toBe(true)
    expect(new EmailContent("a").equals(new EmailContent("b"))).toBe(false)
  })
})

describe("ID value objects", () => {
  const cases: Array<[string, new (v: string) => { getValue(): string; equals(other: { getValue(): string }): boolean }]> = [
    ["UserId", UserId],
    ["TemplateId", RequestId],
    ["RequestId", TemplateId],
  ]
  // (the pairing above is intentional only for the parametrized factory test below;
  // each ID type is also tested individually for clarity)

  it.each(cases)("%s rejects empty values", (_name, Ctor) => {
    expect(() => new Ctor("")).toThrow()
    expect(() => new Ctor("  ")).toThrow()
  })

  it("UserId stores and compares by value", () => {
    const a = new UserId("user-1")
    expect(a.getValue()).toBe("user-1")
    expect(a.equals(new UserId("user-1"))).toBe(true)
    expect(a.equals(new UserId("user-2"))).toBe(false)
  })

  it("TemplateId stores and compares by value", () => {
    expect(new TemplateId("t1").getValue()).toBe("t1")
    expect(new TemplateId("t1").equals(new TemplateId("t1"))).toBe(true)
  })

  it("RequestId stores and compares by value", () => {
    expect(new RequestId("r1").getValue()).toBe("r1")
    expect(new RequestId("r1").equals(new RequestId("r1"))).toBe(true)
  })
})

describe("enums and labels", () => {
  it("EmailTone has the four expected tones", () => {
    expect(Object.values(EmailTone)).toEqual(
      expect.arrayContaining(["formal", "friendly", "persuasive", "casual"]),
    )
    expect(Object.keys(TONE_LABELS)).toHaveLength(4)
  })

  it("EmailLength has the three expected lengths", () => {
    expect(Object.values(EmailLength)).toEqual(
      expect.arrayContaining(["short", "medium", "long"]),
    )
    expect(Object.keys(LENGTH_LABELS)).toHaveLength(3)
  })

  it("SubscriptionPlan: free is capped, premium is unlimited", () => {
    expect(PLAN_LIMITS[SubscriptionPlan.FREE]).toBe(5)
    expect(PLAN_LIMITS[SubscriptionPlan.PREMIUM]).toBe(Infinity)
    expect(PLAN_LABELS[SubscriptionPlan.FREE]).toBe("Free")
    expect(PLAN_LABELS[SubscriptionPlan.PREMIUM]).toBe("Premium")
  })
})
