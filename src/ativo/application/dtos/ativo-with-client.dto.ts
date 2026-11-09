export interface AtivoWithClientDTO {
    id_ativo: number
    id_cliente: number
    descricao: string
    tipo: string
    marca: string | null
    modelo: string | null
    identificacao: string | null
    observacoes: string | null
    ativo: boolean
    data_cadastro: Date
    cliente: {
        id_cliente: number
        nome: string
        documento: string
    }
}