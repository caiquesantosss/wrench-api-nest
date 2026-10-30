export type TipoOperacaoAuditoria = 'INSERT' | 'UPDATE' | 'DELETE' | 'STATUS_TOGGLE'

export class LogAuditoria {
    private _id_auditoria?: number
    private _id_usuario: number
    private _tabela_afetada: string
    private _operacao: TipoOperacaoAuditoria
    private _registro_id: number
    private _descricao?: string | null
    private _dados_anteriores?: Record<string, any> | null
    private _dados_novos?: Record<string, any> | null
    private _data_evento: Date

    private constructor(
        id_usuario: number,
        tabela_afetada: string,
        operacao: TipoOperacaoAuditoria,
        registro_id: number,
        descricao?: string | null,
        dados_anteriores?: Record<string, any> | null,
        dados_novos?: Record<string, any> | null,
        data_evento: Date = new Date(),
        id_auditoria?: number
    ) {
        this._id_usuario = id_usuario
        this._tabela_afetada = tabela_afetada
        this._operacao = operacao
        this._registro_id = registro_id
        this._descricao = descricao
        this._dados_anteriores = dados_anteriores
        this._dados_novos = dados_novos
        this._data_evento = data_evento
        this._id_auditoria = id_auditoria
    }

    public static create(
        id_usuario: number,
        tabela_afetada: string,
        operacao: TipoOperacaoAuditoria,
        registro_id: number,
        descricao?: string | null,
        dados_anteriores: any = null,
        dados_novos: any = null
    ): LogAuditoria {
        return new LogAuditoria(
            id_usuario, tabela_afetada, operacao, registro_id, descricao, dados_anteriores, dados_novos
        )
    }

    get id_usuario() { return this._id_usuario }
    get tabela_afetada() { return this._tabela_afetada }
    get operacao() { return this._operacao }
    get registro_id() { return this._registro_id }
    get descricao() { return this._descricao }
    get dados_anteriores() { return this._dados_anteriores }
    get dados_novos() { return this._dados_novos }
}