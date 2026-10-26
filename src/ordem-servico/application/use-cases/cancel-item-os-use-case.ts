import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository"
import { OrdemServico } from "../../domain/entities/OrdemServico"

@Injectable()
export class CancelItemOsUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly ordemServicoRepository: OrdemServicoRepository
    ) {}

    async execute(id_os: number): Promise<OrdemServico> {
        const serviceOrder = await this.ordemServicoRepository.findById(id_os)

        if (!serviceOrder) {
            throw new NotFoundException('Não foi possível localizar a ordem de serviço')
        }

        serviceOrder.cancelItem()

        return await this.ordemServicoRepository.save(serviceOrder)
    }
}