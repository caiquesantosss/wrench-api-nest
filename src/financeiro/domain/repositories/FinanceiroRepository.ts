import { OrdemServico } from "../../../generated/prisma/client";
import { LancamentoFinanceiro } from "../entities/LancamentoFinanceiro";

export interface FinanceiroRepository {
    save(lancamento: LancamentoFinanceiro): Promise<LancamentoFinanceiro>
    findById(id: number): Promise<LancamentoFinanceiro | null>
    listByClient(id_cliente: number): Promise<LancamentoFinanceiro[]>
    listPending(): Promise<LancamentoFinanceiro[]>
    findByOS(id_os: number): Promise<LancamentoFinanceiro | null>
}