import { LogAuditoria } from '../entities/LogAuditoria'
import { UsuarioAuditoriaDTO } from '../../application/dtos/list-log-auditoria-with-user.dto'

export interface LogAuditoriaRepository {
    findById(id: number): Promise<LogAuditoria | null>
    listAllWithUser(): Promise<{ log: LogAuditoria; usuario: UsuarioAuditoriaDTO }[]>
}