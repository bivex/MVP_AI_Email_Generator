export class TemplateId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("TemplateId cannot be empty")
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: TemplateId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
