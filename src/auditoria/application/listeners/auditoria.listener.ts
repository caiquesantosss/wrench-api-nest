import { Injectable } from "@nestjs/common"
import { LogAuditoria, TipoOperacaoAuditoria } from "../../domain/entities/LogAuditoria"
import { PrismaService } from "../../../prisma/prisma.service"
import { OnEvent } from "@nestjs/event-emitter"

export class EventAuditoriaDTO {
    id_usuario: number
    tabela_afetada: string
    operacao: TipoOperacaoAuditoria
    registro_id: number
    descricao?: string
    dados_anteriores?: any
    dados_novos?: any
}

@Injectable()
export class AuditoriaListener {
    constructor(private readonly prisma: PrismaService) { }

    @OnEvent('auditoria.registrar', { async: true })
    async manageAuditLog(payload: EventAuditoriaDTO) {
        console.log(`[LISTENER AUDITORIA] Recebeu evento para a tabela: ${payload.tabela_afetada}`)
        console.log(`[LISTENER AUDITORIA] Recebeu evento...`);

        try {
            const log = LogAuditoria.create(
                payload.id_usuario,
                payload.tabela_afetada,
                payload.operacao,
                payload.registro_id,
                payload.descricao,
                payload.dados_anteriores,
                payload.dados_novos
            )

            await this.prisma.auditoria.create({
                data: {
                    id_usuario: log.id_usuario,
                    tabela_afetada: log.tabela_afetada,
                    operacao: log.operacao,
                    registro_id: log.registro_id,
                    descricao: log.descricao ?? null,
                    dados_anteriores: log.dados_anteriores ?? undefined,
                    dados_novos: log.dados_novos ?? undefined,
                }
            })
        } catch (error) {
            console.error('[AuditoriaListener] Falha ao guardar log na base de dados:', error)
        }
    }
}