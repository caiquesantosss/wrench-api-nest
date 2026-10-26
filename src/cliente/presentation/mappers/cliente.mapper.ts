import { Cliente } from '../../domain/entities/Cliente'

export class ClienteMapper {
  static toHttp(cliente: Cliente) {
    return {
      id_cliente: cliente.id_cliente,
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      documento: cliente.documento,
      endereco: cliente.endereco,
      ativo: cliente.ativo,
      data_cadastro: cliente.data_cadastro,
    }
  }
}