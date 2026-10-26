import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { AtivoRepository } from "../../domain/repositories/AtivoRepository"
import { Ativo } from "../../domain/entities/ativo"
import { NotFoundError } from "rxjs"

@Injectable()
export class FindAtivoUseCase {
    constructor(
        @Inject('AtivoRepository')
        private readonly ativoRepository: AtivoRepository
    ) { }

    async execute(id_ativo: number): Promise<Ativo> {
        const ativo = await this.ativoRepository.findById(id_ativo)

        if (ativo === null) {
            throw new NotFoundException(`Ativo com ID ${id_ativo} não encontrado.`)
        }

        return ativo
    }
}