import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FinanceiroRepository } from "../../domain/repositories/FinanceiroRepository";
import { PaymentRegisterDTO } from "../dtos/payment-register.dto";
import { LancamentoFinanceiro } from "../../domain/entities/LancamentoFinanceiro";

@Injectable()
export class RegisterPaymentUseCase {
    constructor(
        @Inject('FinanceiroRepository') 
        private readonly financeiroRepository: FinanceiroRepository
    ) {}

    async execute(id_financeiro: number, data: PaymentRegisterDTO): Promise<LancamentoFinanceiro> {
        const lancamento = await this.financeiroRepository.findById(
            id_financeiro
        )

        if (!lancamento) {
            throw new NotFoundException(
                'Não foi possível encontrar um lançamento financeiro.'
            )
        }

        try {
            lancamento.registerPayment(data.forma_pagamento)

            return await this.financeiroRepository.save(lancamento)
        } catch (error) {
            throw new BadRequestException(error)
        }
    }
}