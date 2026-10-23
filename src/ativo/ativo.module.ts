import { Module } from '@nestjs/common';
import { AtivoController } from './presentation/ativo.controller'
import { CreateAtivoUseCase } from './application/use-cases/create-ativo-use-case'
import { PrismaAtivoRepository } from './infrastructure/database/PrismaAtivoRepository'
import { FindAtivoUseCase } from './application/use-cases/find-ativo-use-case';

@Module({
  controllers: [AtivoController],
  providers: [
    {
      provide: 'AtivoRepository',
      useClass: PrismaAtivoRepository,
    },
    CreateAtivoUseCase,
    FindAtivoUseCase
  ],
  exports: ['AtivoRepository']
})
export class AtivoModule { }