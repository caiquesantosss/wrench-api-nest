import { Inject, Injectable } from "@nestjs/common";
import { FinanceiroRepository } from "../../domain/repositories/FinanceiroRepository";
import { LancamentoFinanceiro } from "../../domain/entities/LancamentoFinanceiro";

@Injectable()
export class ListPendingOsChargeUseCase {
   constructor(
        @Inject('FinanceiroRepository')
        private readonly financeiroRepository: FinanceiroRepository 
   ) {} 

   async execute(): Promise<LancamentoFinanceiro[]> {
        return await this.financeiroRepository.listAll()
   }
}