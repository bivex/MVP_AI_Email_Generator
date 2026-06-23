export class EmailContent {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Email content cannot be empty")
    }
  }

  getValue(): string {
    return this.value
  }

  getPlainText(): string {
    return this.value.replace(/<[^>]*>/g, "").trim()
  }

  equals(other: EmailContent): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
