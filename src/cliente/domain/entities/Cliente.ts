export class Cliente {
    private _id_cliente?: number
    private _nome: string
    private _documento: string
    private _telefone?: string
    private _email?: string | null
    private _endereco?: string | null
    private _ativo: boolean
    private _data_cadastro: Date

    private constructor(
        nome: string,
        documento: string,
        telefone?: string,
        data_cadastro: Date = new Date(),
        email?: string | null,
        endereco?: string | null,
        ativo: boolean = true,
        id_cliente?: number
    ) {
        this._nome = nome
        this._documento = documento
        this._telefone = telefone
        this._data_cadastro = data_cadastro
        this._email = email
        this._endereco = endereco
        this._ativo = ativo
        this._id_cliente = id_cliente
    }

    public static create(
        nome: string,
        documento: string,
        telefone?: string,
        email?: string | null,
        endereco?: string | null
    ): Cliente {
        const cleanDocument = documento.replace(/\D/g, '')

        const cliente = new Cliente(
            nome,
            cleanDocument,
            telefone,
            new Date(),
            email,
            endereco
        )

        cliente.StateValidation()

        return cliente
    }

    public static recover(
        id_cliente: number,
        nome: string,
        documento: string,
        ativo: boolean,
        data_cadastro: Date,
        telefone?: string,
        email?: string | null,
        endereco?: string | null
    ): Cliente {
        return new Cliente(
            nome,
            documento,
            telefone,
            data_cadastro,
            email,
            endereco,
            ativo,
            id_cliente
        )
    }

    public updateDetails(
        nome: string,
        documento: string,
        telefone?: string,
        email?: string | null,
        endereco?: string | null
    ): void {
        const cleanDocument = documento.replace(/\D/g, '')

        const updatedData = {
            nome,
            documento: cleanDocument,
        }

        this.StateValidation(updatedData.nome, updatedData.documento)

        this._nome = nome
        this._documento = cleanDocument
        this._telefone = telefone
        this._email = email
        this._endereco = endereco
    }

    public deactivate(): void {
        if (!this._ativo) {
            throw new Error('Client is already inactive.')
        }

        this._ativo = false
    }

    public activate(): void {
        if (this._ativo) {
            throw new Error('Client is already active.')
        }

        this._ativo = true
    }

    private StateValidation(
        nome: string = this._nome,
        documento: string = this._documento
    ): void {
        if (!nome || nome.trim().length < 3) {
            throw new Error('Client name must contain at least 3 characters.')
        }

        if (!documento) {
            throw new Error('Client document is required.')
        }

        const cleanDocument = documento.replace(/\D/g, '')

        if (cleanDocument.length !== 11 && cleanDocument.length !== 14) {
            throw new Error('Invalid document. It must be a CPF (11 digits) or CNPJ (14 digits).')
        }
    }

    get id_cliente() { return this._id_cliente }
    get nome() { return this._nome }
    get documento() { return this._documento }
    get telefone() { return this._telefone }
    get email() { return this._email }
    get endereco() { return this._endereco }
    get ativo() { return this._ativo }
    get data_cadastro() { return this._data_cadastro }
}