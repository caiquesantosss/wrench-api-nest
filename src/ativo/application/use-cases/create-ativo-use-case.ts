import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { AtivoRepository } from "../../domain/repositories/AtivoRepository";
import { CreateAtivoDTO } from "../dtos/create-ativo.dto";
import { Ativo } from "../../domain/entities/ativo";

@Injectable()
export class CreateAtivoUseCase {
    constructor(
        @Inject('AtivoRepository')
        private readonly ativoRepository: AtivoRepository
    ) { }

    async execute(data: CreateAtivoDTO): Promise<Ativo> {
        if (data.identificacao) {
            const FormatedIdentification = data.identificacao.trim().toUpperCase()
            const existsAtivo = await this.ativoRepository.findByIdentification(
                FormatedIdentification
            )

            if (existsAtivo) {
                throw new ConflictException(
                    'Já existe um cadastro com identificação'
                )
            }
        }

        const newAtivo = Ativo.create(
            data.id_cliente,
            data.descricao,
            data.tipo,
            data.marca ?? null,
            data.modelo ?? null,
            data.identificacao ?? null,
            data.observacoes ?? null
        )

        return await this.ativoRepository.save(newAtivo)
    }
}