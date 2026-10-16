export class User {

    private _id_usuario?: number
    private _nome: string
    private _email: string
    private _senha_hash: string
    private _perfil: string
    private _ativo: boolean

    constructor(
        nome: string,
        email: string,
        senha_hash: string,
        perfil: string,
        id_User?: number,
        ativo: boolean = true
    ) {
        this._nome = nome
        this._email = email
        this._senha_hash = senha_hash
        this._perfil = perfil
        this._id_usuario = id_User
        this._ativo = ativo
    }

    public static create(nome: string, email: string, senha_hash: string, perfil: string): User {
        const user = new User(nome, email, senha_hash, perfil)
        return user
    }

    public static recover(
        id_usuario: number,
        nome: string,
        email: string,
        senha_hash: string,
        perfil: string,
        ativo: boolean
    ): User {
        return new User(nome, email, senha_hash, perfil, id_usuario, ativo)
    }

    public deactivate(): void {
        if (!this._ativo) throw new Error('User is already inactive.')
        this._ativo = false
    }

    public activate(): void {
        if (this._ativo) throw new Error('User is already active.')
        this._ativo = true
    }

    private StateValidation(): void {
        if (this._nome.trim().length < 3) {
            throw new Error('Name must be at least 3 characters long.')
        }

        if (!this._email.includes('@')) {
            throw new Error('Invalid email address.')
        }
    }

    get id_usuario() { return this._id_usuario }
    get nome() { return this._nome }
    get email() { return this._email }
    get senha_hash() { return this._senha_hash }
    get perfil() { return this._perfil }
    get ativo() { return this._ativo }
}