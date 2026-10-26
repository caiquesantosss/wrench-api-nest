import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AtivoRepository } from "../../domain/repositories/AtivoRepository";
import { Ativo } from "../../domain/entities/ativo";

@Injectable()
export class ToggleAtivoStatusUseCase {
    constructor(
        @Inject('AtivoRepository')
        private readonly ativoRepository: AtivoRepository
    ) {}

    async execute(id_ativo: number): Promise<Ativo> {
        const existsAtivo = await this.ativoRepository.findById(id_ativo)

        if (!existsAtivo) {
            throw new NotFoundException(
                'Não foi possível encontrar um ativo.'
            )
        }

        existsAtivo.toggleStatus()

        return await this.ativoRepository.save(existsAtivo)
    }
}