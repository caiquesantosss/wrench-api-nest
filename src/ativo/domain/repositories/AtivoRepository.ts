import { Ativo } from "../entities/ativo"

export interface AtivoRepository {
    save(ativo: Ativo): Promise<Ativo>
    findById(id: number): Promise<Ativo | null>
    listAll(): Promise<Ativo[]>
    listByClient(id_client: number): Promise<Ativo[]>
    findByIdentification(identificacao: string): Promise<Ativo | null>
}