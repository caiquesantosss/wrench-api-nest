import { FinanceiroResponseDTO } from "../../application/dtos/list-all-os.dto";
import { LancamentoFinanceiro } from "../entities/LancamentoFinanceiro";

export interface FinanceiroRepository {
    save(lancamento: LancamentoFinanceiro): Promise<LancamentoFinanceiro>
    findById(id: number): Promise<LancamentoFinanceiro | null>
    listByClient(id_cliente: number): Promise<LancamentoFinanceiro[]>
    listAll(): Promise<LancamentoFinanceiro[]>
    findByOS(id_os: number): Promise<LancamentoFinanceiro | null>
    listAllWithOS(): Promise<FinanceiroResponseDTO[]>
}