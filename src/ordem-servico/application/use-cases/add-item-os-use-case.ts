import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common'

import { OrdemServicoRepository } from '../../domain/repositories/OrdemServicoRepository'
import { CatalogItemRepository } from '../../../catalogo-item/domain/repositories/CatalogItemRepository'
import { AddItemOsDTO } from '../dtos/add-item-os.dto'
import { OrdemServico } from '../../domain/entities/OrdemServico'

@Injectable()
export class AddItemOsUseCase {
    constructor(
        @Inject('OrdemServicoRepository')
        private readonly serviceOrderRepository: OrdemServicoRepository,

        @Inject('CatalogItemRepository')
        private readonly catalogItemRepository: CatalogItemRepository,
    ) { }

    async execute(
        serviceOrderId: number,
        data: AddItemOsDTO,
    ): Promise<OrdemServico> {
        const serviceOrder =
            await this.serviceOrderRepository.findById(serviceOrderId)

        if (!serviceOrder) {
            throw new NotFoundException(
                'A ordem de serviço não pode ser encontrada.',
            )
        }

        const catalogItem = await this.catalogItemRepository.findById(
            data.id_catalogo_item,
        )

        if (!catalogItem) {
            throw new NotFoundException(
                'Item do catálogo não pode ser encontrado.',
            )
        }

        if (!catalogItem.active) {
            throw new BadRequestException(
                'Não é possível adicionar um item inativo.',
            )
        }

        if (catalogItem.id_catalogo_item === undefined) {
            throw new BadRequestException(
                'O item do catálogo não possui um identificador válido.',
            )
        }

        if (catalogItem.valor_unitario === undefined) {
            throw new BadRequestException(
                'O item do catálogo não possui um preço definido.',
            )
        }

        serviceOrder.addItem(
            catalogItem.id_catalogo_item,
            catalogItem.tipo_item,
            data.quantidade,
            Number(catalogItem.valor_unitario),
        )

        return await this.serviceOrderRepository.save(serviceOrder)
    }
}