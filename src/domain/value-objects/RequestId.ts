export class RequestId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("RequestId cannot be empty")
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: RequestId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
