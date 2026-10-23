import { Module } from '@nestjs/common'
import { ClienteController } from './presentation/cliente.controller'
import { PrismaClientRepository } from './infrastructure/database/PrismaClientRepository'
import { CreateClientUseCase } from './application/use-cases/create-client-use-case'

import { UsuarioModule } from '../usuario/usuario.module'

@Module({
  imports: [UsuarioModule], 
  controllers: [ClienteController],
  providers: [
    {
      provide: 'ClientRepository',
      useClass: PrismaClientRepository, 
    },
    CreateClientUseCase,
  ],

  exports: ['ClientRepository'],
})
export class ClienteModule {}