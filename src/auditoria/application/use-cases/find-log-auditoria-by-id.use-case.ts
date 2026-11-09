import { Inject, Injectable } from '@nestjs/common'

import { LogAuditoria } from '../../domain/entities/LogAuditoria'
import { LogAuditoriaRepository } from '../../domain/repository/auditoriaRepository'

@Injectable()
export class FindLogAuditoriaByIdUseCase {
    constructor(
        @Inject('LogAuditoriaRepository')
        private logAuditoriaRepository: LogAuditoriaRepository
    ) {}

    async execute(id: number): Promise<LogAuditoria | null> {
        return this.logAuditoriaRepository.findById(id)
    }
}