export class Cliente {
    private _id_cliente?: number
    private _nome: string
    private _documento: string
    private _telefone?: string
    private _email?: string
    private _endereco?: string
    private _ativo: boolean

    private constructor(
        nome: string,
        documento: string,
        telefone?: string,
        email?: string,
        endereco?: string,
        ativo: boolean = true,
        id_cliente?: number
    ) {
        this._nome = nome
        this._documento = documento
        this._telefone = telefone
        this._email = email
        this._endereco = endereco
        this._ativo = ativo
        this._id_cliente = id_cliente
    }

    public static create(
        nome: string, documento: string, telefone?: string, email?: string, endereco?: string
    ): Cliente {
        const cliente = new Cliente(nome, documento, telefone, email, endereco)
        cliente.StateValidation()
        return cliente
    }

    public static recover(
        id_cliente: number, nome: string, documento: string, ativo: boolean,
        telefone?: string, email?: string, endereco?: string
    ): Cliente {
        return new Cliente(nome, documento, telefone, email, endereco, ativo, id_cliente)
    }

    public deactivate(): void {
        this._ativo = false
    }

    public activate(): void {
        if (this._ativo) throw new Error('User is already active.')
        this._ativo = true
    }

    private StateValidation(): void {
        if (this._nome.trim().length < 3) throw new Error('Nome do cliente muito curto.')

        const docLimpo = this._documento.replace(/\D/g, '')
        if (docLimpo.length !== 11 && docLimpo.length !== 14) {
            throw new Error('Documento inválido. Deve ser CPF (11) ou CNPJ (14).')
        }
    }

    get id_cliente() { return this._id_cliente }
    get nome() { return this._nome }
    get documento() { return this._documento }
    get telefone() { return this._telefone }
    get email() { return this._email }
    get endereco() { return this._endereco }
    get ativo() { return this._ativo }
}
