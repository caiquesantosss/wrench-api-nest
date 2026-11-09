import { AtivoWithClientDTO } from "../../application/dtos/ativo-with-client.dto"

export class AtivoWithClientMapper {
    static toHttp(ativo: AtivoWithClientDTO) {
        return {
            id_ativo: ativo.id_ativo,
            id_cliente: ativo.id_cliente,
            descricao: ativo.descricao,
            tipo: ativo.tipo,
            marca: ativo.marca,
            modelo: ativo.modelo,
            identificacao: ativo.identificacao,
            observacoes: ativo.observacoes,
            ativo: ativo.ativo,
            data_cadastro: ativo.data_cadastro,
            cliente: {
                id_cliente: ativo.cliente.id_cliente,
                nome: ativo.cliente.nome,
                documento: ativo.cliente.documento
            }
        }
    }

    static toHttpList(ativos: AtivoWithClientDTO[]) {
        return ativos.map(ativo => this.toHttp(ativo))
    }
}