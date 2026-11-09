import { AtivoWithClientDTO } from "../../application/dtos/ativo-with-client.dto"
import { Ativo } from "../entities/ativo"

export interface AtivoRepository {
    save(ativo: Ativo): Promise<Ativo>
    findById(id: number): Promise<Ativo | null>
    listAll(): Promise<Ativo[]>
    listAllWithClient(): Promise<AtivoWithClientDTO[]>
    listByClient(id_client: number): Promise<Ativo[]>
    findByIdentification(identificacao: string): Promise<Ativo | null>
}