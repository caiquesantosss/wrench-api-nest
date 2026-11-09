import { Inject, Injectable } from '@nestjs/common'

import { LogAuditoriaRepository } from '../../domain/repository/auditoriaRepository'
import { UsuarioAuditoriaDTO } from '../dtos/list-log-auditoria-with-user.dto'
import { LogAuditoria } from '../../domain/entities/LogAuditoria'

@Injectable()
export class ListAllLogAuditoriaWithUserUseCase {
    constructor(
        @Inject('LogAuditoriaRepository')
        private logAuditoriaRepository: LogAuditoriaRepository
    ) { }

    async execute(): Promise<{ log: LogAuditoria; usuario: UsuarioAuditoriaDTO }[]> {
        return this.logAuditoriaRepository.listAllWithUser()
    }
}