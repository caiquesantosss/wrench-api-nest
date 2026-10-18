import { OrdemServico } from '../entities/OrdemServico'

export interface OrdemServicoRepository {
    save(ordemServico: OrdemServico): Promise<OrdemServico>
    findById(id: number): Promise<OrdemServico | null>
}