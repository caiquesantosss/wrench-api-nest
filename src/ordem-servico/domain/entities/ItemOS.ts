export class ItemOS {
  private _id_item_os?: number
  private _id_catalogo_item: number
  private _tipo_item: 'PRODUTO' | 'SERVICO' 
  private _quantidade: number
  private _valor_unitario: number
  private _valor_total: number
  private _status_aprovacao: string | null
  private _baixa_estoque: boolean
  private _data_cadastro: Date

  private constructor(
    id_catalogo_item: number,
    tipo_item: 'PRODUTO' | 'SERVICO',
    quantidade: number,
    valor_unitario: number,
    status_aprovacao: string | null = null,
    baixa_estoque: boolean = false,
    data_cadastro: Date = new Date(),
    id_item_os?: number
  ) {
    this._id_catalogo_item = id_catalogo_item
    this._tipo_item = tipo_item
    this._quantidade = quantidade
    this._valor_unitario = valor_unitario
    this._valor_total = quantidade * valor_unitario 
    this._status_aprovacao = status_aprovacao
    this._baixa_estoque = baixa_estoque
    this._data_cadastro = data_cadastro
    this._id_item_os = id_item_os
  }

  public static create(
    id_catalogo_item: number,
    tipo_item: 'PRODUTO' | 'SERVICO',
    quantidade: number,
    valor_unitario: number
  ): ItemOS {
    if (quantidade <= 0) throw new Error('A quantidade deve ser maior que zero.')
    if (valor_unitario < 0) throw new Error('O valor unitário não pode ser negativo.')

    return new ItemOS(id_catalogo_item, tipo_item, quantidade, valor_unitario)
  }

  public static recover(
    id_item_os: number,
    id_catalogo_item: number,
    tipo_item: string,
    quantidade: number,
    valor_unitario: number,
    status_aprovacao: string | null,
    baixa_estoque: boolean,
    data_cadastro: Date
  ): ItemOS {
    return new ItemOS(
      id_catalogo_item, 
      tipo_item as 'PRODUTO' | 'SERVICO', 
      quantidade, 
      valor_unitario, 
      status_aprovacao, 
      baixa_estoque, 
      data_cadastro, 
      id_item_os
    )
  }

  public markAsProcessed(): void {
    if (this._tipo_item === 'SERVICO') return
    if (this._baixa_estoque) throw new Error('A baixa de estoque já foi realizada para este item.')
    
    this._baixa_estoque = true
  }

  public aproveItem(): void {
    this._status_aprovacao = 'APROVADO'
  }

  public rejectItem(): void {
    this._status_aprovacao = 'REJEITADO'
  }

  get id_item_os() { return this._id_item_os }
  get id_catalogo_item() { return this._id_catalogo_item }
  get tipo_item() { return this._tipo_item }
  get quantidade() { return this._quantidade }
  get valor_unitario() { return this._valor_unitario }
  get valor_total() { return this._valor_total }
  get status_aprovacao() { return this._status_aprovacao }
  get baixa_estoque() { return this._baixa_estoque }
  get data_cadastro() { return this._data_cadastro }
}