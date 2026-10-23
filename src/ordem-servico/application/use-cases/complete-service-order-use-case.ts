import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { UnitOfWork } from '../../../shared/application/interfaces/unit-of-work.interface'
import { OrdemServico } from '../../domain/entities/OrdemServico'

@Injectable()
export class CompleteServiceOrderUseCase {
  constructor(
    @Inject('UnitOfWork')
    private readonly uow: UnitOfWork,
  ) {}

  async execute(serviceOrderId: number, solucaoAplicada: string): Promise<OrdemServico> {
    return this.uow.runInTransaction(async (osRepo, catalogRepo) => {
      const serviceOrder = await osRepo.findById(serviceOrderId)

      if (!serviceOrder) {
        throw new NotFoundException('Ordem de serviço não encontrada.')
      }

      serviceOrder.completeService(solucaoAplicada)

      for (const item of serviceOrder.items) {
        if (
          item.tipo_item === 'PRODUTO' &&
          item.status_aprovacao !== 'REJEITADO' &&
          !item.baixa_estoque
        ) {
          const catalogItem = await catalogRepo.findById(item.id_catalogo_item)

          if (!catalogItem) {
            throw new BadRequestException(
              `Produto ${item.id_catalogo_item} não encontrado.`,
            )
          }

          catalogItem.removeStock(Number(item.quantidade))

          await catalogRepo.save(catalogItem)

          item.markAsProcessed()
        }
      }

      return osRepo.save(serviceOrder)
    })
  }
}