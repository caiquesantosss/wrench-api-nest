import { Cliente } from "../entities/Cliente";

export interface ClientRepository {
    saveCLient(cliente: Cliente): Promise<Cliente>
    findClientByDocument(documento: string): Promise<Cliente | null>
    findClientById(id: number): Promise<Cliente | null>
}