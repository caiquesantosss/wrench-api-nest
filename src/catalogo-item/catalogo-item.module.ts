import { Module } from '@nestjs/common';
import { CatalogoItemController } from './presentation/catalogo-item.controller';

import { UsuarioModule } from '../usuario/usuario.module';
import { PrismaCatalogItemRepository } from './infrastructure/database/PrismaCatalogItemRepository';
import { CreateCatalogItemUseCase } from './application/use-cases/create-catalog-item-use-case';

@Module({
  imports: [UsuarioModule],
  controllers: [CatalogoItemController],
  providers: [
    {
      provide: 'CatalogItemRepository',
      useClass: PrismaCatalogItemRepository,
    },
    CreateCatalogItemUseCase,
  ],
  exports: ['CatalogItemRepository'], 
})
export class CatalogoItemModule {}