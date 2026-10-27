import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository";
import { OrdemServico } from "../../domain/entities/OrdemServico";

@Injectable()
export class UpdateEstimateCompletionUseCase {      
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly ordemServicoRepository: OrdemServicoRepository
    ) {}

    async execute(id_os: number, newDateISO: string): Promise<OrdemServico> {
        const os = await this.ordemServicoRepository.findById(
            id_os
        )

        if (!os) {
            throw new NotFoundException(
                'Não foi possível encontrar a ordem de serviço'
            )
        }

        try {
            os.updateEstimatedCompletionDate(new Date(newDateISO))

            return await this.ordemServicoRepository.save(os)
        } catch (error) {
            throw new BadRequestException(error)
        }
    }
}