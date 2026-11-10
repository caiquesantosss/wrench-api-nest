import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"
import { env } from "../env/env"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { RequestContext } from "../shared/context/request-context"
import { TipoOperacaoAuditoria } from "../auditoria/domain/entities/LogAuditoria"

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2
  ) {
    const connectionString = env.DATABASE_URL

    if (!connectionString) {
      throw new Error("A variável DATABASE_URL não está definida.")
    }

    const adapter = new PrismaPg({ connectionString })

    super({ adapter })

    if (!this.eventEmitter) {
      throw new Error(
        "EventEmitter2 não foi injetado no PrismaService."
      )
    }

    console.log(
      "EventEmitter2 injetado:",
      this.eventEmitter.constructor.name
    )

    const auditoriaEmitter = this.eventEmitter

    const extensao = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            if (model === "Auditoria") {
              return query(args)
            }

            const idUsuario = RequestContext.getStore()?.userId ?? 0

            if (operation === "create") {
              console.log(`[PRISMA EXTENSION] Interceptou um CREATE na tabela: ${model}`)
              const result = await query(args) as Record<string, any>

              if (model && result) {
                const pkName = `id_${model.toLowerCase()}`
                const registroId = result[pkName] ?? result["id"] ?? 0

                auditoriaEmitter.emit("auditoria.registrar", {
                  id_usuario: idUsuario,
                  tabela_afetada: model,
                  operacao: "INSERT" as TipoOperacaoAuditoria,
                  registro_id: registroId,
                  dados_novos: result
                })
              }

              return result
            }

            if (operation === "update") {
              const result = await query(args) as Record<string, any>

              if (model && result) {
                const pkName = `id_${model.toLowerCase()}`
                const registroId = result[pkName] ?? result["id"] ?? 0

                auditoriaEmitter.emit("auditoria.registrar", {
                  id_usuario: idUsuario,
                  tabela_afetada: model,
                  operacao: "UPDATE" as TipoOperacaoAuditoria,
                  registro_id: registroId,
                  dados_novos: result
                })
              }

              return result
            }

            if (operation === "delete") {
              const result = await query(args) as Record<string, any>

              if (model && result) {
                const pkName = `id_${model.toLowerCase()}`
                const registroId = result[pkName] ?? result["id"] ?? 0

                auditoriaEmitter.emit("auditoria.registrar", {
                  id_usuario: idUsuario,
                  tabela_afetada: model,
                  operacao: "DELETE" as TipoOperacaoAuditoria,
                  registro_id: registroId,
                  dados_anteriores: result
                })
              }

              return result
            }

            return query(args)
          }
        }
      }
    })

    Object.assign(this, extensao)
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}