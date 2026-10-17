export class Ativo {
    private _id_ativo?: number
    private _id_cliente: number
    private _descricao: string
    private _tipo: string
    private _marca?: string
    private _modelo?: string
    private _identificacao?: string
    private _observacoes?: string
    private _ativo: boolean

    private constructor(
        id_cliente: number,
        descricao: string,
        tipo: string,
        marca?: string,
        modelo?: string,
        identificacao?: string,
        observacoes?: string,
        ativo: boolean = true,
        id_ativo?: number
    ) {
        this._descricao = descricao
        this._tipo = tipo
        this._marca = marca
        this._modelo = modelo
        this._identificacao = identificacao
        this._observacoes = observacoes
        this._ativo = ativo
        this._id_cliente = id_cliente
        this._id_ativo = id_ativo
    }

    public static create(
        id_cliente: number, descricao: string, tipo: string,
        marca?: string, modelo?: string, identificacao?: string, observacoes?: string
    ): Ativo {
        const ativo = new Ativo(id_cliente, descricao, tipo, marca, modelo, identificacao, observacoes)
        ativo.StateValidation()
        return ativo
    }

    public static recover(
        id_ativo: number, id_cliente: number, descricao: string, tipo: string, ativo: boolean,
        marca?: string, modelo?: string, identificacao?: string, observacoes?: string
    ): Ativo {
        return new Ativo(id_cliente, descricao, tipo, marca, modelo, identificacao, observacoes, ativo, id_ativo)
    }

    private StateValidation(): void {
        const tiposPermitidos = ['VEICULO', 'MAQUINA_PNEUMATICA', 'EQUIPAMENTO_INDUSTRIAL']
        if (!tiposPermitidos.includes(this._tipo.toUpperCase())) {
            throw new Error('Tipo de ativo não suportado pelo WrenchOS.')
        }
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
}