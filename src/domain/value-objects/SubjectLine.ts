export class SubjectLine {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Subject line cannot be empty")
    }
    if (value.length > 200) {
      throw new Error("Subject line cannot exceed 200 characters")
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: SubjectLine): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
