import { Inject, Injectable } from "@nestjs/common"
import { FinanceiroRepository } from "../../domain/repositories/FinanceiroRepository"
import { FinanceiroResponseDTO } from "../dtos/list-all-os.dto" 

@Injectable()
export class ListAllOSChargeUseCase {
   constructor(
        @Inject('FinanceiroRepository')
        private readonly financeiroRepository: FinanceiroRepository 
   ) {} 

   async execute(): Promise<FinanceiroResponseDTO[]> {
        const lancamentos = await this.financeiroRepository.listAll()

        return lancamentos.map(lancamento => ({
            id_financeiro: lancamento.id_financeiro,
            id_ordem_servico: lancamento.id_ordem_servico,
            descricao: lancamento.descricao,
            tipo_lancamento: lancamento.tipo_lancamento,
            status_pagamento: lancamento.status_pagamento,
            valor: Number(lancamento.valor), 
            forma_pagamento: lancamento.forma_pagamento ?? null,
            referencia_externa: lancamento.referencia_externa ?? null,
            data_vencimento: lancamento.data_vencimento ?? null,
            data_pagamento: lancamento.data_pagamento ?? null,
            data_cadastro: lancamento.data_cadastro,
        }))
   }
}