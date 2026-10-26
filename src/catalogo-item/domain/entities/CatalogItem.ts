export type TipoItem = 'PRODUTO' | 'SERVICO'

export class CatalogItem {
    private _id_catalogo_item?: number
    private _descricao: string
    private _tipo_item: TipoItem
    private _unidade: string
    private _valor_unitario: number
    private _estoque_atual: number
    private _estoque_minimo: number
    private _ativo: boolean
    private _data_cadastro: Date

    private constructor(
        descricao: string,
        tipo_item: TipoItem,
        unidade: string,
        valor_unitario: number,
        estoque_atual: number,
        estoque_minimo: number,
        ativo: boolean,
        data_cadastro: Date,
        id_catalogo_item?: number,
    ) {
        this._descricao = descricao
        this._tipo_item = tipo_item
        this._unidade = unidade
        this._valor_unitario = valor_unitario
        this._estoque_atual = estoque_atual
        this._estoque_minimo = estoque_minimo
        this._ativo = ativo
        this._data_cadastro = data_cadastro
        this._id_catalogo_item = id_catalogo_item
    }


    public static create(
        descricao: string,
        tipo_item: TipoItem,
        unidade: string,
        valor_unitario: number = 0,
        estoque_atual: number = 0,
        estoque_minimo: number = 0
    ): CatalogItem {
        if (valor_unitario < 0) {
            throw new Error('O valor unitário não pode ser negativo.')
        }

        const realInventory = tipo_item === 'SERVICO' ? 0 : estoque_atual
        const minRealInventory = tipo_item === 'SERVICO' ? 0 : estoque_minimo

        if (realInventory < 0 || minRealInventory < 0) {
            throw new Error('As quantidades do estoque não podem ser negativas')
        }

        return new CatalogItem(
            descricao,
            tipo_item,
            unidade,
            valor_unitario,
            realInventory,
            minRealInventory,
            true,
            new Date()
        )
    }

    public static recover(
        id_catalogo_item: number,
        descricao: string,
        tipo_item: string,
        unidade: string,
        valor_unitario: number,
        estoque_atual: number,
        estoque_minimo: number,
        ativo: boolean,
        data_cadastro: Date
    ): CatalogItem {
        return new CatalogItem(
            descricao, tipo_item as TipoItem, unidade, valor_unitario,
            estoque_atual, estoque_minimo, ativo, data_cadastro, id_catalogo_item
        )
    }

    public updatePrice(newValue: number): void {
        if (newValue < 0) {
            throw new Error('O valo unitário não pode ser negativo.')
        }

        this._valor_unitario = newValue
    }

    public updateBasicDatas(descricao: string, unidade: string): void {
        if (!descricao || descricao.trim().length < 3) {
            throw new Error('A descrição deve ter pelo menos 3 caracteres')
        }

        if (!unidade || unidade.trim().length === 0) {
            throw new Error('A unidade de medida é obrigatória.')
        }

        this._descricao = descricao
        this._unidade = unidade
    }

    public addStock(quantity: number): void {
        if (this._tipo_item === 'SERVICO') {
            throw new Error('Não é possível adicionar estoque de um serviço')
        }

        if (quantity <= 0) {
            throw new Error('A quantidade deve ser maior que 0')
        }

        this._estoque_atual += quantity
    }

    public removeStock(quantity: number): void {
        if (this._tipo_item === 'SERVICO') {
            throw new Error('Não é possível remover estoque de um serviço')
        }

        if (quantity <= 0) {
            throw new Error('A quantidade  a remover deve ser maior que 0')
        }

        if (this._estoque_atual - quantity < 0) {
            throw new Error('Estoque insuficiente para realizar a baixa.')
        }

        this._estoque_atual -= quantity
    }

    public desactive(): void {
        this._ativo = false
    }

    public active(): void {
        this._ativo = true
    }

    public isLowInventory(): boolean {
        if (this._tipo_item === 'SERVICO') return false

        return this.estoque_atual <= this._estoque_minimo
    }

    get id_catalogo_item() { return this._id_catalogo_item }
    get descricao() { return this._descricao }
    get tipo_item() { return this._tipo_item }
    get unidade() { return this._unidade }
    get valor_unitario() { return this._valor_unitario }
    get estoque_atual() { return this._estoque_atual }
    get estoque_minimo() { return this._estoque_minimo }
    get ativo() { return this._ativo }
    get data_cadastro() { return this._data_cadastro }
}