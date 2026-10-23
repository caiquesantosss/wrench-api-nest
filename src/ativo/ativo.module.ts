import { Module } from '@nestjs/common';
import { PrismaAtivoRepository } from './infrastructure/database/PrismaAtivoRepository'

@Module({
  providers: [
    {
      provide: 'AtivoRepository',
      useClass: PrismaAtivoRepository,
    },
  ],
  exports: ['AtivoRepository'] 
})
export class AtivoModule {}