import { StatusPagamento, TipoLancamento, MetodoPagamento } from "../../domain/entities/LancamentoFinanceiro"

export type OrdemServicoFinanceiroDTO = {
    id_ordem_servico: number
    status: string
    descricao_problema: string
    diagnostico: string | null
    solucao_aplicada: string | null
    valor_mao_obra: number
    valor_pecas: number
    valor_total: number
    data_abertura: Date
    data_previsao: Date | null
    data_conclusao: Date | null
}

export type FinanceiroResponseDTO = {
    id_financeiro?: number
    id_ordem_servico: number
    descricao: string
    tipo_lancamento: TipoLancamento
    status_pagamento: StatusPagamento
    valor: number
    forma_pagamento: MetodoPagamento | null
    referencia_externa: string | null
    data_vencimento: Date | null
    data_pagamento: Date | null
    data_cadastro: Date
    ordem_servico: OrdemServicoFinanceiroDTO
}