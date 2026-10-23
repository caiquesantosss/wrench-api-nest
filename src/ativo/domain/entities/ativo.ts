export class Ativo {
  private _id_ativo?: number
  private _id_cliente: number
  private _descricao: string
  private _tipo: string
  private _marca?: string | null
  private _modelo?: string | null
  private _identificacao?: string | null
  private _observacoes?: string | null
  private _ativo: boolean
  private _data_cadastro: Date

  private constructor(
    id_cliente: number,
    descricao: string,
    tipo: string,
    ativo: boolean = true,
    data_cadastro: Date = new Date(),
    marca?: string | null,
    modelo?: string | null,
    identificacao?: string | null,
    observacoes?: string | null,
    id_ativo?: number
  ) {
    this._id_cliente = id_cliente
    this._descricao = descricao
    this._tipo = tipo
    this._ativo = ativo
    this._data_cadastro = data_cadastro
    this._marca = marca
    this._modelo = modelo
    this._identificacao = identificacao
    this._observacoes = observacoes
    this._id_ativo = id_ativo
  }

  public static create(
    id_cliente: number,
    descricao: string,
    tipo: string,
    marca?: string | null,
    modelo?: string | null,
    identificacao?: string | null,
    observacoes?: string | null
  ): Ativo {
    if (!descricao || descricao.trim().length === 0) {
      throw new Error('A descrição do ativo é obrigatória.')
    }
    if (!tipo || tipo.trim().length === 0) {
      throw new Error('O tipo do ativo é obrigatório.')
    }

    const idFormatada = identificacao ? identificacao.trim().toUpperCase() : null

    return new Ativo(
      id_cliente,
      descricao,
      tipo,
      true,
      new Date(),
      marca,
      modelo,
      idFormatada,
      observacoes
    )
  }

  public static recover(
    id_ativo: number,
    id_cliente: number,
    descricao: string,
    tipo: string,
    ativo: boolean,
    data_cadastro: Date,
    marca?: string | null,
    modelo?: string | null,
    identificacao?: string | null,
    observacoes?: string | null
  ): Ativo {
    return new Ativo(
      id_cliente, descricao, tipo, ativo, data_cadastro, 
      marca, modelo, identificacao, observacoes, id_ativo
    )
  }


  public inativate(): void {
    if (!this._ativo) throw new Error('Este ativo já está inativo.')
    this._ativo = false
  }

  public updateDetails(
    descricao: string, 
    tipo: string, 
    marca?: string | null, 
    modelo?: string | null, 
    identificacao?: string | null, 
    observacoes?: string | null
  ): void {
    if (!this._ativo) throw new Error('Não é possível alterar um ativo inativado.')
    if (!descricao || descricao.trim().length === 0) throw new Error('A descrição é obrigatória.')
    if (!tipo || tipo.trim().length === 0) throw new Error('O tipo é obrigatório.')
    
    this._descricao = descricao
    this._tipo = tipo
    this._marca = marca
    this._modelo = modelo
    this._identificacao = identificacao ? identificacao.trim().toUpperCase() : null
    this._observacoes = observacoes
  }


  get id_ativo() { return this._id_ativo }
  get id_cliente() { return this._id_cliente }
  get descricao() { return this._descricao }
  get tipo() { return this._tipo }
  get marca() { return this._marca }
  get modelo() { return this._modelo }
  get identificacao() { return this._identificacao }
  get observacoes() { return this._observacoes }
  get ativo() { return this._ativo }
  get data_cadastro() { return this._data_cadastro }
}