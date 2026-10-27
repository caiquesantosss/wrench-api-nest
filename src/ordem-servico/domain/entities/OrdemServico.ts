import { ItemOS } from './ItemOS'

export type StatusOS =
    | 'ABERTA'
    | 'ORCAMENTO_PENDENTE'
    | 'AGUARDANDO_APROVACAO'
    | 'EM_EXECUCAO'
    | 'CONCLUIDA'
    | 'CANCELADA'

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
    private _itens: ItemOS[] = []

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
            throw new Error(
                'Não é possível alterar uma OS já Concluída ou Cancelada.'
            )
        }
    }

    public addItem(
        idCatalogoItem: number,
        tipoItem: 'PRODUTO' | 'SERVICO',
        quantidade: number,
        precoUnitario: number
    ): void {
        this.checkIfFrozen()

        const itemExistente = this._itens.find(
            i => i.id_catalogo_item === idCatalogoItem
        )

        if (itemExistente) {
            throw new Error(
                'Este item já foi adicionado. Remova-o e adicione novamente com a nova quantidade.'
            )
        }

        const novoItem = ItemOS.create(
            idCatalogoItem,
            tipoItem,
            quantidade,
            precoUnitario
        )

        this._itens.push(novoItem)
        this.recalculateTotals()
    }

    public removeItem(idCatalogoItem: number): void {
        this.checkIfFrozen()

        const tamanhoAnterior = this._itens.length

        this._itens = this._itens.filter(
            i => i.id_catalogo_item !== idCatalogoItem
        )

        if (this._itens.length === tamanhoAnterior) {
            throw new Error(
                'O item não foi encontrado na Ordem de Serviço.'
            )
        }

        if (this._itens.length === 0) {
            this._status = "ORCAMENTO_PENDENTE"
        }

        this.recalculateTotals()
    }

    public loadItemsFromDatabase(itens: ItemOS[]): void {
        this._itens = itens
    }

    private recalculateTotals(): void {
        const itensValidos = this._itens.filter(
            item => item.status_aprovacao !== 'REJEITADO'
        )

        this._valor_pecas = itensValidos
            .filter(item => item.tipo_item === 'PRODUTO')
            .reduce((acc, item) => acc + item.valor_total, 0)

        this._valor_mao_obra = itensValidos
            .filter(item => item.tipo_item === 'SERVICO')
            .reduce((acc, item) => acc + item.valor_total, 0)

        this._valor_total = this._valor_pecas + this._valor_mao_obra
        this.updateDate()
    }

    public setDiagnosis(diagnostico: string): void {
        this.checkIfFrozen()

        this._diagnostico = diagnostico
        this._status = 'ORCAMENTO_PENDENTE'
        this.updateDate()
    }

    public setBudget(
        valorMaoObra: number,
        dataPrevisao?: Date
    ): void {
        this.checkIfFrozen()

        if (this._status !== 'ORCAMENTO_PENDENTE') {
            throw new Error(
                'Apenas OS em ORCAMENTO_PENDENTE pode receber orçamento.'
            )
        }

        if (this._itens.length === 0) {
            throw new Error(
                'É necessário adicionar pelo menos um item (peça ou serviço) antes de fechar o orçamento.'
            )
        }

        if (valorMaoObra < 0) {
            throw new Error(
                'O valor da mão de obra não pode ser negativo.'
            )
        }

        this._valor_mao_obra = valorMaoObra

        this._valor_total = this._valor_pecas + this._valor_mao_obra

        if (dataPrevisao) {
            this._data_previsao = dataPrevisao
        }

        this._status = 'AGUARDANDO_APROVACAO'
        this.updateDate()

    }

    public updateEstimatedCompletionDate(newDate: Date): void {
        const today = new Date()

        today.setHours(0, 0, 0, 0)

        if (newDate < today) {
            throw new Error('A nova data não pode estar no passado')
        }

        if (this._status === 'CONCLUIDA' || this._status === 'CANCELADA') {
            throw new Error(
                'Não é possível alterar a previsão de uma OS já finalizada.'
            )
        }

        this._data_previsao = newDate

    }

    public cancelItem(): void {
        this.checkIfFrozen()

        this._status = 'CANCELADA'
        this.updateDate()
    }

    public startExecution(): void {
        this.checkIfFrozen()

        if (this._status !== 'AGUARDANDO_APROVACAO') {
            throw new Error(
                'O orçamento deve ser aprovado antes de iniciar a execução.'
            )
        }

        this._status = 'EM_EXECUCAO'
        this.updateDate()
    }

    public completeService(solucaoAplicada: string): void {
        if (this._status !== 'EM_EXECUCAO') {
            throw new Error(
                'Apenas uma OS EM_EXECUCAO pode ser concluída.'
            )
        }

        this._solucao_aplicada = solucaoAplicada
        this._status = 'CONCLUIDA'
        this._data_conclusao = new Date()
        this.updateDate()
    }

    get id_ordem_servico() {
        return this._id_ordem_servico
    }

    get id_cliente() {
        return this._id_cliente
    }

    get id_ativo() {
        return this._id_ativo
    }

    get id_usuario() {
        return this._id_usuario
    }

    get status() {
        return this._status
    }

    get descricao_problema() {
        return this._descricao_problema
    }

    get diagnostico() {
        return this._diagnostico
    }

    get solucao_aplicada() {
        return this._solucao_aplicada
    }

    get valor_mao_obra() {
        return this._valor_mao_obra
    }

    get valor_pecas() {
        return this._valor_pecas
    }

    get valor_total() {
        return this._valor_total
    }

    get data_abertura() {
        return this._data_abertura
    }

    get data_previsao() {
        return this._data_previsao
    }

    get data_conclusao() {
        return this._data_conclusao
    }

    get data_atualizacao() {
        return this._data_atualizacao
    }

    get items(): ItemOS[] {
        return [...this._itens]
    }

}