import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { AtivoRepository } from "../../domain/repositories/AtivoRepository"
import { Ativo } from "../../domain/entities/ativo"
import { UpdateAtivoDTO } from "../dtos/update-details-ativo.dto"

@Injectable()
export class UpdateDetailsAtivoUseCase {
    constructor(
        @Inject('AtivoRepository')
        private readonly ativoRepository: AtivoRepository
    ) { }

    async execute(
        id_ativo: number,
        data: UpdateAtivoDTO
    ): Promise<Ativo> {
        const existsAtivo = await this.ativoRepository.findById(id_ativo)

        if (!existsAtivo) {
            throw new NotFoundException(
                'Não foi possível encontrar um ativo.'
            )
        }

        if (data.identificacao !== undefined && data.identificacao !== null) {
            const identificacaoFormatada = data.identificacao.trim().toUpperCase();

            if (existsAtivo.identificacao !== identificacaoFormatada) {
                const ativoExistente = await this.ativoRepository.findByIdentification(
                    identificacaoFormatada
                )

                if (ativoExistente && ativoExistente.id_ativo !== id_ativo) {
                    throw new ConflictException(
                        `Já existe outro ativo cadastrado com a identificação ${identificacaoFormatada}.`
                    )
                }
            }
        }

        existsAtivo.updateDetails(
            data.descricao, 
            data.tipo,      
            data.marca !== undefined ? data.marca : existsAtivo.marca,
            data.modelo !== undefined ? data.modelo : existsAtivo.modelo,
            data.identificacao !== undefined ? data.identificacao : existsAtivo.identificacao,
            data.observacoes !== undefined ? data.observacoes : existsAtivo.observacoes
        )

        return await this.ativoRepository.save(existsAtivo)
    }
}