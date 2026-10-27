import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { FinanceiroController } from './presentation/financeiro.controller'
import { PrismaFinanceiroRepository } from './infrastructure/database/PrismaFinanceiroRepository'

@Module({
  imports: [PrismaModule],
  controllers: [FinanceiroController],
  providers: [
    {
      provide: 'FinanceiroRepository',
      useClass: PrismaFinanceiroRepository,
    },
  ],
  exports: ['FinanceiroRepository']
})
export class FinanceiroModule {}