import { AsyncLocalStorage } from "async_hooks"

export interface RequestContextData {
    userId?: number
}

// Armazena o contexto da requisição atual, mantendo os dados disponíveis durante todo o seu ciclo de vida.
export const RequestContext = new AsyncLocalStorage<RequestContextData>()