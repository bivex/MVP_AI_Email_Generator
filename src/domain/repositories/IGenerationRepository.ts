import { GenerationRequest } from "../entities/GenerationRequest"
import { RequestId } from "../value-objects/RequestId"
import { UserId } from "../value-objects/UserId"

export interface IGenerationRepository {
  save(request: GenerationRequest): Promise<void>
  findById(id: RequestId): Promise<GenerationRequest | null>
  findByUserId(userId: UserId): Promise<GenerationRequest[]>
}
