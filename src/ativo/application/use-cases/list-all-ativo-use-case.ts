import { Inject, Injectable } from "@nestjs/common"
import { AtivoRepository } from "../../domain/repositories/AtivoRepository"
import { Ativo } from "../../domain/entities/ativo"

@Injectable()
export class ListAllAtivoUseCase {
    constructor(
        @Inject('AtivoRepository')
        private readonly ativoRepository: AtivoRepository,
    ) { }

    async execute(): Promise<Ativo[]> {
        return await this.ativoRepository.listAll()
    }
}