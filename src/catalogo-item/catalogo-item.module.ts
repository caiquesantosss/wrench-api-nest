import { Module } from '@nestjs/common'
import { CatalogoItemController } from './presentation/catalogo-item.controller'

import { UsuarioModule } from '../usuario/usuario.module'
import { PrismaCatalogItemRepository } from './infrastructure/database/PrismaCatalogItemRepository'
import { CreateCatalogItemUseCase } from './application/use-cases/create-catalog-item-use-case'
import { ListCatalogItemUseCase } from './application/use-cases/list-catalog-item-use-case'
import { UpdateCatalogItemUseCase } from './application/use-cases/update-catalog-item-use-case'
import { UpdateStatusCatalogItem } from './application/use-cases/update-status-catalog-item-use-case'
import { AddStockUseCase } from './application/use-cases/add-stock-use-case'
import { RemoveStockUseCase } from './application/use-cases/remove-stock-use-case'

@Module({
  imports: [UsuarioModule],
  controllers: [CatalogoItemController],
  providers: [
    {
      provide: 'CatalogItemRepository',
      useClass: PrismaCatalogItemRepository,
    },
    CreateCatalogItemUseCase,
    ListCatalogItemUseCase,
    UpdateCatalogItemUseCase,
    UpdateStatusCatalogItem, 
    AddStockUseCase, 
    RemoveStockUseCase
  ],
  exports: ['CatalogItemRepository'],
})
export class CatalogoItemModule { }