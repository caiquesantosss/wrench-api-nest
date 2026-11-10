import { Global, Module } from "@nestjs/common"
import { EventEmitterModule } from "@nestjs/event-emitter"

import { PrismaService } from "./prisma.service"

@Global()
@Module({
  imports: [EventEmitterModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}