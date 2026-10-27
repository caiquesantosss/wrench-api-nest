export type StatusPagamento =
    | 'PENDENTE'
    | 'PAGO'
    | 'CANCELADO'
    | 'ATRASADO'

export type TipoLancamento =
    | 'RECEITA'
    | 'DESPESA'

export type MetodoPagamento =
    | 'PIX'
    | 'CARTAO_CREDITO'
    | 'CARTAO_DEBITO'
    | 'DINHEIRO'
    | 'BOLETO'
    | 'TRANSFERENCIA'
    | null

export class LancamentoFinanceiro {
    private _id_financeiro?: number
    private _id_ordem_servico: number
    private _descricao: string
    private _tipo_lancamento: TipoLancamento
    private _status_pagamento: StatusPagamento
    private _valor: number
    private _forma_pagamento?: MetodoPagamento
    private _referencia_externa?: string | null
    private _data_vencimento?: Date | null
    private _data_pagamento?: Date | null
    private _data_cadastro: Date

    private constructor(
        id_ordem_servico: number,
        descricao: string,
        tipo_lancamento: TipoLancamento,
        valor: number,
        status_pagamento: StatusPagamento = 'PENDENTE',
        data_vencimento?: Date | null,
        forma_pagamento?: MetodoPagamento,
        referencia_externa?: string | null,
        data_pagamento?: Date | null,
        data_cadastro: Date = new Date(),
        id_financeiro?: number
    ) {
        if (
            !Number.isInteger(id_ordem_servico) ||
            id_ordem_servico <= 0
        ) {
            throw new Error(
                'É obrigatório informar uma ordem de serviço válida.'
            )
        }

        if (valor <= 0) {
            throw new Error(
                'O valor do lançamento deve ser maior que zero.'
            )
        }

        this._id_ordem_servico = id_ordem_servico
        this._descricao = descricao
        this._tipo_lancamento = tipo_lancamento
        this._valor = valor
        this._status_pagamento = status_pagamento
        this._data_vencimento = data_vencimento
        this._forma_pagamento = forma_pagamento
        this._referencia_externa = referencia_externa
        this._data_pagamento = data_pagamento
        this._data_cadastro = data_cadastro
        this._id_financeiro = id_financeiro
    }

    public static create(
        id_ordem_servico: number,
        descricao: string,
        valor: number,
        data_vencimento?: Date | null,
        referencia_externa?: string | null
    ): LancamentoFinanceiro {
        return new LancamentoFinanceiro(
            id_ordem_servico,
            descricao,
            'RECEITA',
            valor,
            'PENDENTE',
            data_vencimento,
            null,
            referencia_externa
        )
    }

    public static recover(
        id_financeiro: number,
        id_ordem_servico: number,
        descricao: string,
        tipo_lancamento: TipoLancamento,
        status_pagamento: StatusPagamento,
        valor: number,
        forma_pagamento: MetodoPagamento,
        referencia_externa: string | null,
        data_vencimento: Date | null,
        data_pagamento: Date | null,
        data_cadastro: Date
    ): LancamentoFinanceiro {
        return new LancamentoFinanceiro(
            id_ordem_servico,
            descricao,
            tipo_lancamento,
            valor,
            status_pagamento,
            data_vencimento,
            forma_pagamento,
            referencia_externa,
            data_pagamento,
            data_cadastro,
            id_financeiro
        )
    }

    public registerPayment(
        metodo: MetodoPagamento,
        referencia_externa?: string
    ): void {
        if (this._status_pagamento === 'PAGO') {
            throw new Error(
                'Este lançamento já se encontra pago.'
            )
        }

        if (this._status_pagamento === 'CANCELADO') {
            throw new Error(
                'Não é possível pagar um lançamento cancelado.'
            )
        }

        if (!metodo) {
            throw new Error(
                'É obrigatório informar a forma de pagamento.'
            )
        }

        this._status_pagamento = 'PAGO'
        this._data_pagamento = new Date()
        this._forma_pagamento = metodo

        if (referencia_externa) {
            this._referencia_externa = referencia_externa
        }
    }

    public cancel(): void {
        if (this._status_pagamento === 'PAGO') {
            throw new Error(
                'Não é possível cancelar um lançamento que já foi pago. É necessário estornar.'
            )
        }

        this._status_pagamento = 'CANCELADO'
    }

    get id_financeiro() {
        return this._id_financeiro
    }

    get id_ordem_servico() {
        return this._id_ordem_servico
    }

    get descricao() {
        return this._descricao
    }

    get tipo_lancamento() {
        return this._tipo_lancamento
    }

    get status_pagamento() {
        return this._status_pagamento
    }

    get valor() {
        return this._valor
    }

    get forma_pagamento() {
        return this._forma_pagamento
    }

    get referencia_externa() {
        return this._referencia_externa
    }

    get data_vencimento() {
        return this._data_vencimento
    }

    get data_pagamento() {
        return this._data_pagamento
    }

    get data_cadastro() {
        return this._data_cadastro
    }
}