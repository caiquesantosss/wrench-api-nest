import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { OrdemServicoRepository } from '../../domain/repositories/OrdemServicoRepository'
import { CatalogItemRepository } from '../../../catalogo-item/domain/repositories/CatalogItemRepository'
import { OrdemServico } from '../../domain/entities/OrdemServico'

@Injectable()
export class CompleteServiceOrderUseCase {
  constructor(
    @Inject('OrdemServicoRepository')
    private readonly ordemServicoRepository: OrdemServicoRepository,

    @Inject('CatalogItemRepository')
    private readonly catalogItemRepository: CatalogItemRepository,
  ) {}

  async execute(
    id_os: number,
    appliedSolution: string,
  ): Promise<OrdemServico> {
    const serviceOrder =
      await this.ordemServicoRepository.findById(id_os)

    if (!serviceOrder) {
      throw new NotFoundException(
        'Não foi possível localizar a ordem de serviço.',
      )
    }

    serviceOrder.completeService(appliedSolution)

    for (const item of serviceOrder.items) {
      if (
        item.tipo_item !== 'PRODUTO' ||
        item.status_aprovacao === 'REJEITADO' ||
        item.baixa_estoque
      ) {
        continue
      }

      const catalogItem =
        await this.catalogItemRepository.findById(
          item.id_catalogo_item,
        )

      if (!catalogItem) {
        throw new NotFoundException(
          `Produto ${item.id_catalogo_item} não encontrado no catálogo.`,
        )
      }

      catalogItem.removeStock(Number(item.quantidade))

      await this.catalogItemRepository.save(catalogItem)

      item.markAsProcessed()
    }

    return this.ordemServicoRepository.save(serviceOrder)
  }
}
