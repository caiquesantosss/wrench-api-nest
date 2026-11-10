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
        private readonly ordemServicoRepository: OrdemServicoRepository,

        @Inject('CatalogItemRepository')
        private readonly catalogItemRepository: CatalogItemRepository,
    ) {}

    async execute(
        serviceOrderId: number,
        items: AddItemOsDTO[],
    ): Promise<OrdemServico> {
        const serviceOrder =
            await this.ordemServicoRepository.findById(serviceOrderId)

        if (!serviceOrder) {
            throw new NotFoundException(
                'A ordem de serviço não pode ser encontrada.',
            )
        }

        if (!items.length) {
            throw new BadRequestException(
                'É necessário informar pelo menos um item.',
            )
        }

        const itemIds = items.map(item => item.id_catalogo_item)

        if (new Set(itemIds).size !== itemIds.length) {
            throw new BadRequestException(
                'Não é permitido enviar o mesmo item do catálogo mais de uma vez.',
            )
        }

        const validatedItems = await Promise.all(
            items.map(async data => {
                const catalogItem =
                    await this.catalogItemRepository.findById(
                        data.id_catalogo_item,
                    )

                if (!catalogItem) {
                    throw new NotFoundException(
                        `O item de catálogo ${data.id_catalogo_item} não foi encontrado.`,
                    )
                }

                if (!catalogItem.active) {
                    throw new BadRequestException(
                        `O item ${data.id_catalogo_item} está inativo.`,
                    )
                }

                if (catalogItem.id_catalogo_item === undefined) {
                    throw new BadRequestException(
                        'O item do catálogo não possui um identificador válido.',
                    )
                }

                if (catalogItem.valor_unitario === undefined) {
                    throw new BadRequestException(
                        `O item ${data.id_catalogo_item} não possui um preço definido.`,
                    )
                }

                return {
                    data,
                    catalogItem,
                }
            }),
        )

        for (const { data, catalogItem } of validatedItems) {
            serviceOrder.addItem(
                catalogItem.id_catalogo_item!,
                catalogItem.tipo_item,
                data.quantidade,
                Number(catalogItem.valor_unitario),
            )
        }

        return await this.ordemServicoRepository.save(serviceOrder)
    }
}