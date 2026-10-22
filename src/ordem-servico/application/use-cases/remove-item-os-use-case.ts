import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrdemServicoRepository } from "../../domain/repositories/OrdemServicoRepository";
import { OrdemServico } from "../../domain/entities/OrdemServico";

@Injectable()
export class RemoveItemOsUseCase {
    constructor(
        @Inject('OrdemServicoRepository') 
        private readonly ordemServicoRepository: OrdemServicoRepository
    ) {}

    async execute(serviceOrderId: number, catalogItemId: number): Promise<OrdemServico> {
        const serviceOrder = await this.ordemServicoRepository.findById(
            serviceOrderId
        )

        if (!serviceOrder) {
            throw new NotFoundException('A ordem de serviço não pode ser encontrada')
        }

        serviceOrder.removeItem(catalogItemId)

        return await this.ordemServicoRepository.save(serviceOrder)
    }
}