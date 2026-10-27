import { Injectable, Inject } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { FinanceiroRepository } from '../../domain/repositories/FinanceiroRepository'
import {
    LancamentoFinanceiro,
    StatusPagamento,
    TipoLancamento,
    MetodoPagamento,
} from '../../domain/entities/LancamentoFinanceiro'
import { Prisma } from '../../../generated/prisma/client'

@Injectable()
export class PrismaFinanceiroRepository implements FinanceiroRepository {
    constructor(
        @Inject(PrismaService)
        private readonly prisma: Prisma.TransactionClient
    ) {}

    async save(
        lancamento: LancamentoFinanceiro
    ): Promise<LancamentoFinanceiro> {
        const data = {
            id_ordem_servico: lancamento.id_ordem_servico,
            descricao: lancamento.descricao,
            tipo_lancamento: lancamento.tipo_lancamento,
            status_pagamento: lancamento.status_pagamento,
            valor: lancamento.valor,
            forma_pagamento: lancamento.forma_pagamento ?? null,
            referencia_externa: lancamento.referencia_externa ?? null,
            data_vencimento: lancamento.data_vencimento ?? null,
            data_pagamento: lancamento.data_pagamento ?? null,
        }

        const lancamentoSalvo = lancamento.id_financeiro
            ? await this.prisma.financeiro.update({
                  where: {
                      id_financeiro: lancamento.id_financeiro,
                  },
                  data,
              })
            : await this.prisma.financeiro.create({
                  data,
              })

        return this.mapToDomain(lancamentoSalvo)
    }

    async findById(
        id: number
    ): Promise<LancamentoFinanceiro | null> {
        const lancamentoDb = await this.prisma.financeiro.findUnique({
            where: {
                id_financeiro: id,
            },
        })

        if (!lancamentoDb) {
            return null
        }

        return this.mapToDomain(lancamentoDb)
    }

    async listByClient(
        id_cliente: number
    ): Promise<LancamentoFinanceiro[]> {
        const lancamentosDb = await this.prisma.financeiro.findMany({
            where: {
                ordem_servico: {
                    id_cliente,
                },
            },
            orderBy: {
                data_vencimento: 'desc',
            },
        })

        return lancamentosDb.map(
            lancamento => this.mapToDomain(lancamento)
        )
    }

    async listAll(): Promise<LancamentoFinanceiro[]> {
        const lancamentosDb = await this.prisma.financeiro.findMany({
            orderBy: {
                data_cadastro: 'asc',
            },
        })

        return lancamentosDb.map(
            lancamento => this.mapToDomain(lancamento)
        )
    }

    async findByOS(
        id_os: number
    ): Promise<LancamentoFinanceiro | null> {
        const lancamentoDb = await this.prisma.financeiro.findFirst({
            where: {
                id_ordem_servico: id_os,
            },
        })

        if (!lancamentoDb) {
            return null
        }

        return this.mapToDomain(lancamentoDb)
    }

    private mapToDomain(raw: any): LancamentoFinanceiro {
        return LancamentoFinanceiro.recover(
            raw.id_financeiro,
            raw.id_ordem_servico,
            raw.descricao,
            raw.tipo_lancamento as TipoLancamento,
            raw.status_pagamento as StatusPagamento,
            Number(raw.valor),
            raw.forma_pagamento as MetodoPagamento,
            raw.referencia_externa,
            raw.data_vencimento,
            raw.data_pagamento,
            raw.data_cadastro
        )
    }
}