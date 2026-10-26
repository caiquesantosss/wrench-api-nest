import { Module } from '@nestjs/common'
import { AtivoController } from './presentation/ativo.controller'
import { CreateAtivoUseCase } from './application/use-cases/create-ativo-use-case'
import { PrismaAtivoRepository } from './infrastructure/database/PrismaAtivoRepository'
import { FindAtivoUseCase } from './application/use-cases/find-ativo-use-case'
import { ListAtivoUseCase } from './application/use-cases/list-ativo-use-case'
import { PrismaClientRepository } from '../cliente/infrastructure/database/PrismaClientRepository'
import { ToggleAtivoStatusUseCase } from './application/use-cases/toggle-ativo-status-use-case'
import { UpdateDetailsAtivoUseCase } from './application/use-cases/update-details-ativo-use-case'

@Module({
  controllers: [AtivoController],
  providers: [
    {
      provide: 'AtivoRepository',
      useClass: PrismaAtivoRepository,
    },
    {
      provide: 'ClientRepository', 
      useClass: PrismaClientRepository
    },
    CreateAtivoUseCase,
    FindAtivoUseCase,
    ListAtivoUseCase,
    ToggleAtivoStatusUseCase,
    UpdateDetailsAtivoUseCase
  ],
  exports: ['AtivoRepository']
})
export class AtivoModule { }