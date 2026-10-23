import { Module } from '@nestjs/common'
import { OrdemServicoController } from './presentation/ordem-servico.controller'
import { PrismaOrdemServicoRepository } from './infrastructure/database/PrismaOrdemServicoRepository'
import { OpenServiceOrderUseCase } from './application/use-cases/open-service-order-use-case'

import { UsuarioModule } from '../usuario/usuario.module'
import { ClienteModule } from '../cliente/cliente.module'
import { AddDiagnosticUseCase } from './application/use-cases/add-diagnostic-use-case'
import { BudgetDefineUseCase } from './application/use-cases/budget-define-use-case'
import { StartExecutionUseCase } from './application/use-cases/start-execution-use-case'
import { FinishServiceUseCase } from './application/use-cases/finish-service-use-case'
import { AddItemOsUseCase } from './application/use-cases/add-item-os-use-case'
import { CatalogoItemModule } from '../catalogo-item/catalogo-item.module'
import { RemoveItemOsUseCase } from './application/use-cases/remove-item-os-use-case'
import { CancelItemOsUseCase } from './application/use-cases/cancel-item-os-use-case'
import { CompleteServiceOrderUseCase } from './application/use-cases/complete-service-order-use-case'
import { PrismaUnitOfWork } from '../shared/infrastructure/prisma-unit-of-work'

@Module({
  imports: [
    UsuarioModule, 
    ClienteModule, 
    CatalogoItemModule
  ],
  controllers: [OrdemServicoController],
  providers: [
    {
      provide: 'OrdemServicoRepository',
      useClass: PrismaOrdemServicoRepository,
    },
    {
      provide: 'UnitOfWork', 
      useClass: PrismaUnitOfWork
    },
    OpenServiceOrderUseCase,
    AddDiagnosticUseCase, 
    BudgetDefineUseCase, 
    StartExecutionUseCase, 
    FinishServiceUseCase, 
    AddItemOsUseCase,
    RemoveItemOsUseCase, 
    CancelItemOsUseCase, 
    CompleteServiceOrderUseCase
  ],
})
export class OrdemServicoModule {}