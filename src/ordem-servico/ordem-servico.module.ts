import { Module } from '@nestjs/common'
import { OrdemServicoController } from './presentation/ordem-servico.controller'
import { PrismaOrdemServicoRepository } from './infrastructure/database/PrismaOrdemServicoRepository'
import { OpenServiceOrderUseCase } from './application/use-cases/open-service-order-use-case'

import { UsuarioModule } from '../usuario/usuario.module'
import { ClienteModule } from '../cliente/cliente.module'
import { AddDiagnosticUseCase } from './application/use-cases/add-diagnostic-use-case'
import { BudgetDefineUseCase } from './application/use-cases/budget-define-use-case'

@Module({
  imports: [
    UsuarioModule, 
    ClienteModule, 
  ],
  controllers: [OrdemServicoController],
  providers: [
    {
      provide: 'OrdemServicoRepository',
      useClass: PrismaOrdemServicoRepository,
    },
    OpenServiceOrderUseCase,
    AddDiagnosticUseCase, 
    BudgetDefineUseCase
  ],
})
export class OrdemServicoModule {}