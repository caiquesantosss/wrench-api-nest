import { OrdemServicoRepository } from '../../../ordem-servico/domain/repositories/OrdemServicoRepository'
import { CatalogItemRepository } from '../../../catalogo-item/domain/repositories/CatalogItemRepository'
import { AtivoRepository } from '../../../ativo/domain/repositories/AtivoRepository'

export interface UnitOfWork {
  runInTransaction<T>(
    work: (
      osRepo: OrdemServicoRepository,
      catalogRepo: CatalogItemRepository, 
      ativoRepo: AtivoRepository,
    ) => Promise<T>
  ): Promise<T>
}

/**
 * Executa operações de múltiplos repositórios em uma única transação,
 * garantindo o COMMIT em caso de sucesso e ROLLBACK em caso de erro.
 */