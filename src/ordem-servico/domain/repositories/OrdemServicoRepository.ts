import { OrdemServicoListagemDTO } from '../../application/dtos/list-all-os.dto'
import { OrdemServicoDetailsDTO } from '../../application/dtos/order-service-details.dto'
import { OrdemServico } from '../entities/OrdemServico'

export interface OrdemServicoRepository {
    save(ordemServico: OrdemServico): Promise<OrdemServico>
    findById(id: number): Promise<OrdemServico | null>
    findDetailsById(id: number): Promise<OrdemServicoDetailsDTO | null>
    listAll(): Promise<OrdemServicoListagemDTO[]>
}