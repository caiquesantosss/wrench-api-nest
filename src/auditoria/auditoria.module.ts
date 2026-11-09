import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { PrismaModule } from '../prisma/prisma.module'

import { AuditoriaListener } from './application/listeners/auditoria.listener'

import { FindLogAuditoriaByIdUseCase } from './application/use-cases/find-log-auditoria-by-id.use-case'
import { ListAllLogAuditoriaWithUserUseCase } from './application/use-cases/list-all-log-auditoria-with-user.use-case'

import { PrismaLogAuditoriaRepository } from './infrastructure/database/PrismaAuditoriaRepository'
import { AuditoriaController } from './presentation/auditoria.controller'

@Module({
    imports: [
        PrismaModule,
        EventEmitterModule.forRoot()
    ],
    controllers: [AuditoriaController],
    providers: [
        AuditoriaListener,
        FindLogAuditoriaByIdUseCase,
        ListAllLogAuditoriaWithUserUseCase,
        {
            provide: 'LogAuditoriaRepository',
            useClass: PrismaLogAuditoriaRepository
        }
    ],
    exports: [
        FindLogAuditoriaByIdUseCase,
        ListAllLogAuditoriaWithUserUseCase
    ]
})
export class AuditoriaModule { }