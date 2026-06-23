import { DomainError } from "./DomainError"

export class GenerationError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = "GenerationError"
  }
}
