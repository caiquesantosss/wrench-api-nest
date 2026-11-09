import { Injectable } from '@nestjs/common'

import { PrismaService } from '../../../prisma/prisma.service'

import {
    LogAuditoria,
    TipoOperacaoAuditoria
} from '../../domain/entities/LogAuditoria'

import { LogAuditoriaRepository } from '../../domain/repository/auditoriaRepository'
import { UsuarioAuditoriaDTO } from '../../application/dtos/list-log-auditoria-with-user.dto'

@Injectable()
export class PrismaLogAuditoriaRepository implements LogAuditoriaRepository {
    constructor(private prisma: PrismaService) { }

    private toDomain(data: any): LogAuditoria {
        return LogAuditoria.recover(
            data.id_auditoria,
            data.id_usuario,
            data.tabela_afetada,
            data.operacao as TipoOperacaoAuditoria,
            data.registro_id,
            data.descricao,
            data.dados_anteriores,
            data.dados_novos,
            data.data_evento
        )
    }

    async findById(id: number): Promise<LogAuditoria | null> {
        const log = await this.prisma.auditoria.findUnique({
            where: {
                id_auditoria: id
            }
        })

        if (!log) return null

        return this.toDomain(log)
    }

    async listAllWithUser(): Promise<{ log: LogAuditoria; usuario: UsuarioAuditoriaDTO }[]> {
        const logs = await this.prisma.auditoria.findMany({
            include: {
                usuario: {
                    select: {
                        id_usuario: true,
                        nome: true,
                        perfil: true
                    }
                }
            },
            orderBy: {
                data_evento: 'desc'
            }
        })

        return logs.map((item) => ({
            log: this.toDomain(item),
            usuario: item.usuario
        }))
    }
}