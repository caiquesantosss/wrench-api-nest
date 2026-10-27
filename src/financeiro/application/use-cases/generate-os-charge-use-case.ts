import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FinanceiroRepository } from "../../domain/repositories/FinanceiroRepository";
import { OrdemServicoRepository } from "../../../ordem-servico/domain/repositories/OrdemServicoRepository";
import { LancamentoFinanceiro } from "../../domain/entities/LancamentoFinanceiro";

@Injectable()
export class GenerateOSChargeUseCase {
    constructor(
        @Inject('FinanceiroRepository')
        private readonly financeiroRepository: FinanceiroRepository,

        @Inject('OrdemServicoRepository')
        private readonly ordemServicoRepository: OrdemServicoRepository
    ) { }

    async execute(id_os: number, diasVencimento: number = 5): Promise<
        LancamentoFinanceiro
    > {
        const os = await this.ordemServicoRepository.findById(
            id_os
        )

        if (!os) {
            throw new NotFoundException(
                'A ordem de serviço não pode ser encontrada!'
            )
        }

        if (os.status !== 'CONCLUIDA') {
            throw new BadRequestException(
                'Apenas ordens de serviço concluídas podem gerar faturamento.'
            )
        }

        const existsCharge = await this.financeiroRepository.findByOS(id_os)

        if (existsCharge) {
            throw new NotFoundException(
                'Já existe uma cobrança em aberto para esta ordem de serviço'
            )
        }

        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + diasVencimento)

        const description = `Faturamento referente à ordem de serviço #${id_os}`

        const lancamento = LancamentoFinanceiro.create(
            id_os,
            description,
            os.valor_total,
            dueDate,
            `OS-${id_os}` 
        );

        return await this.financeiroRepository.save(lancamento)
    }
}