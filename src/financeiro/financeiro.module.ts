import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { OrdemServicoModule } from '../ordem-servico/ordem-servico.module'

import { FinanceiroController } from './presentation/financeiro.controller'
import { PrismaFinanceiroRepository } from './infrastructure/database/PrismaFinanceiroRepository'
import { GenerateOSChargeUseCase } from './application/use-cases/generate-os-charge-use-case'
import { ListPendingOsChargeUseCase } from './application/use-cases/list-pending-os-charge-use-case'

@Module({
    imports: [
        PrismaModule,
        OrdemServicoModule,
    ],
    controllers: [
        FinanceiroController,
    ],
    providers: [
        {
            provide: 'FinanceiroRepository',
            useClass: PrismaFinanceiroRepository,
        },
        GenerateOSChargeUseCase,
        ListPendingOsChargeUseCase
    ],
    exports: [
        'FinanceiroRepository',
    ],
})
export class FinanceiroModule {}