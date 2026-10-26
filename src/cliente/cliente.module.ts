import { Module } from '@nestjs/common'
import { ClienteController } from './presentation/cliente.controller'
import { PrismaClientRepository } from './infrastructure/database/PrismaClientRepository'
import { CreateClientUseCase } from './application/use-cases/create-client-use-case'

import { UsuarioModule } from '../usuario/usuario.module'
import { FindCLientById } from './application/use-cases/find-client-by-id-use-case'
import { ListAllClientsUseCase } from './application/use-cases/list-all-clients-use-case'

@Module({
  imports: [UsuarioModule], 
  controllers: [ClienteController],
  providers: [
    {
      provide: 'ClientRepository',
      useClass: PrismaClientRepository, 
    },
    CreateClientUseCase,
    FindCLientById, 
    ListAllClientsUseCase
  ],

  exports: ['ClientRepository'],
})
export class ClienteModule {}