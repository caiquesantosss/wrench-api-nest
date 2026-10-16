import { Module } from '@nestjs/common';
import { UsuarioController } from './presentation/usuario.controller';
import { PrismaUserRepository } from './infrastructure/database/PrismaUserRepository';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../env/env';
import { CreateUserUseCase } from './application/use-cases/create-user-use-case';
import { AuthenticateUserUseCase } from './application/use-cases/authenticate-user-use-case';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET, 
      signOptions: { expiresIn: '8h' },
    })
  ],
  controllers: [UsuarioController], 
  providers: [
    {
      provide: 'UserRepository', 
      useClass: PrismaUserRepository,
    }, 
    CreateUserUseCase, 
    AuthenticateUserUseCase
  ],

  exports: [JwtModule]
})
export class UsuarioModule {}
