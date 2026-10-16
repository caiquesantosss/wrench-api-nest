import { Module } from '@nestjs/common';
import { UsuarioController } from './presentation/usuario.controller';
import { PrismaUserRepository } from './infrastructure/database/PrismaUserRepository';

@Module({
  controllers: [UsuarioController], 
  providers: [
    {
      provide: 'UserRepository', 
      useClass: PrismaUserRepository,
    }
  ],
})
export class UsuarioModule {}
