import { Inject, Injectable } from '@nestjs/common'
import { AtivoRepository } from '../../domain/repositories/AtivoRepository'

@Injectable()
export class ListAllAtivosWithClientUseCase {
    constructor(
        @Inject('AtivoRepository')
        private ativoRepository: AtivoRepository
    ) {}

    async execute() {
        return this.ativoRepository.listAllWithClient()
    }
}