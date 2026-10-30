import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditoriaListener } from './application/listeners/auditoria.listener';

@Module({
    imports: [
        PrismaModule
    ], 
    providers: [AuditoriaListener]
})
export class AuditoriaModule {}
