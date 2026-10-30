import { Module } from '@nestjs/common'
import { createObserveModule } from '@nestjs/observe'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PrismaModule } from './prisma/prisma.module'
import { UsuarioModule } from './usuario/usuario.module'
import { ClienteModule } from './cliente/cliente.module'
import { OrdemServicoModule } from './ordem-servico/ordem-servico.module'
import { CatalogoItemModule } from './catalogo-item/catalogo-item.module'
import { AtivoModule } from './ativo/ativo.module'
import { FinanceiroModule } from './financeiro/financeiro.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { EventEmitterModule } from '@nestjs/event-emitter'

export const { ObserveModule, ObserveInstrument } = createObserveModule()

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true, 
      global: true
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'wrenchos-api-nest',
    }),
    PrismaModule,
    UsuarioModule,
    ClienteModule,
    OrdemServicoModule,
    CatalogoItemModule,
    AtivoModule,
    FinanceiroModule,
    AuditoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
