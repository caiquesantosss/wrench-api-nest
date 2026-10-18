export type StatusOS = 'ABERTA' | 'ORCAMENTO_PENDENTE' | 'AGUARDANDO_APROVACAO' | 'EM_EXECUCAO' | 'CONCLUIDA' | 'CANCELADA'

export class OrdemServico {
    private _id_ordem_servico?: number
    private _id_cliente: number
    private _id_ativo: number
    private _id_usuario: number
    private _status: StatusOS
    private _descricao_problema: string
    private _diagnostico?: string
    private _solucao_aplicada?: string
    private _valor_mao_obra: number
    private _valor_pecas: number
    private _valor_total: number
    private _data_abertura: Date
    private _data_previsao?: Date
    private _data_conclusao?: Date
    private _data_atualizacao: Date

    private constructor(
        id_cliente: number,
        id_ativo: number,
        id_usuario: number,
        status: StatusOS,
        descricao_problema: string,
        data_abertura: Date,
        data_atualizacao: Date,
        valor_mao_obra: number = 0,
        valor_pecas: number = 0,
        valor_total: number = 0,
        diagnostico?: string,
        solucao_aplicada?: string,
        data_previsao?: Date,
        data_conclusao?: Date,
        id_ordem_servico?: number
    ) {
        this._id_cliente = id_cliente
        this._id_ativo = id_ativo
        this._id_usuario = id_usuario
        this._status = status
        this._descricao_problema = descricao_problema
        this._data_abertura = data_abertura
        this._data_atualizacao = data_atualizacao
        this._valor_mao_obra = valor_mao_obra
        this._valor_pecas = valor_pecas
        this._valor_total = valor_total
        this._diagnostico = diagnostico
        this._solucao_aplicada = solucao_aplicada
        this._data_previsao = data_previsao
        this._data_conclusao = data_conclusao
        this._id_ordem_servico = id_ordem_servico
    }

    public static create(
        id_cliente: number,
        id_ativo: number,
        id_usuario: number,
        descricao_problema: string
    ): OrdemServico {
        if (!descricao_problema || descricao_problema.trim().length < 5) {
            throw new Error('A descrição do problema é obrigatória.')
        }

        const agora = new Date()

        return new OrdemServico(
            id_cliente,
            id_ativo,
            id_usuario,
            'ABERTA',
            descricao_problema,
            agora,
            agora
        )
    }

    public static recover(
        id_ordem_servico: number,
        id_cliente: number,
        id_ativo: number,
        id_usuario: number,
        status: StatusOS,
        descricao_problema: string,
        data_abertura: Date,
        data_atualizacao: Date,
        valor_mao_obra: number,
        valor_pecas: number,
        valor_total: number,
        diagnostico?: string,
        solucao_aplicada?: string,
        data_previsao?: Date,
        data_conclusao?: Date
    ): OrdemServico {
        return new OrdemServico(
            id_cliente,
            id_ativo,
            id_usuario,
            status,
            descricao_problema,
            data_abertura,
            data_atualizacao,
            valor_mao_obra,
            valor_pecas,
            valor_total,
            diagnostico,
            solucao_aplicada,
            data_previsao,
            data_conclusao,
            id_ordem_servico
        )
    }

    private updateDate(): void {
        this._data_atualizacao = new Date()
    }

    private checkIfFrozen(): void {
        if (this._status === 'CONCLUIDA' || this._status === 'CANCELADA') {
            throw new Error('Não é possível alterar uma OS já Concluída ou Cancelada.')
        }
    }

    public setDiagnosis(diagnostico: string): void {
        this.checkIfFrozen()
        this._diagnostico = diagnostico
        this._status = 'ORCAMENTO_PENDENTE'
        this.updateDate()
    }

    public setBudget(valorPecas: number, valorMaoObra: number, dataPrevisao?: Date): void {
        this.checkIfFrozen()

        if (this._status !== 'ORCAMENTO_PENDENTE') {
            throw new Error('Apenas OS em ORCAMENTO_PENDENTE pode receber valores de orçamento.')
        }

        this._valor_pecas = valorPecas
        this._valor_mao_obra = valorMaoObra
        this._valor_total = valorPecas + valorMaoObra

        if (dataPrevisao) {
            this._data_previsao = dataPrevisao
        }

        this._status = 'AGUARDANDO_APROVACAO'
        this.updateDate()
    }

    public startExecution(): void {
        this.checkIfFrozen()

        if (this._status !== 'AGUARDANDO_APROVACAO') {
            throw new Error('O orçamento deve ser aprovado antes de iniciar a execução.')
        }

        this._status = 'EM_EXECUCAO'
        this.updateDate()
    }

    public completeService(solucaoAplicada: string): void {
        if (this._status !== 'EM_EXECUCAO') {
            throw new Error('Apenas uma OS EM_EXECUCAO pode ser concluída.')
        }

        this._solucao_aplicada = solucaoAplicada
        this._status = 'CONCLUIDA'
        this._data_conclusao = new Date()
        this.updateDate()
    }

    get id_ordem_servico() { return this._id_ordem_servico }
    get id_cliente() { return this._id_cliente }
    get id_ativo() { return this._id_ativo }
    get id_usuario() { return this._id_usuario }
    get status() { return this._status }
    get descricao_problema() { return this._descricao_problema }
    get diagnostico() { return this._diagnostico }
    get solucao_aplicada() { return this._solucao_aplicada }
    get valor_mao_obra() { return this._valor_mao_obra }
    get valor_pecas() { return this._valor_pecas }
    get valor_total() { return this._valor_total }
    get data_abertura() { return this._data_abertura }
    get data_previsao() { return this._data_previsao }
    get data_conclusao() { return this._data_conclusao }
    get data_atualizacao() { return this._data_atualizacao }
}