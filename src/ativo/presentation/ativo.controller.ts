import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiConflictResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe'

import { CreateAtivoDTO, createAtivoSchema } from '../application/dtos/create-ativo.dto'
import { AtivoMapper } from './mappers/ativo.mapper'

import { CreateAtivoUseCase } from '../application/use-cases/create-ativo-use-case'

@ApiTags('Ativos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ativos')
export class AtivoController {
    constructor(
        private readonly createAtivoUseCase: CreateAtivoUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Cadastrar um novo ativo',
        description: 'Registra um novo veículo ou máquina vinculado a um cliente.'
    })
    @ApiBody({
        description: 'Dados necessários para cadastrar um ativo.',
        schema: {
            example: {
                id_cliente: 1,
                descricao: 'Compressor de ar industrial',
                tipo: 'MAQUINA',
                marca: 'Schulz',
                modelo: 'MSV 20 MAX',
                identificacao: 'COMP-001',
                observacoes: 'Equipamento utilizado na área de manutenção.'
            }
        }
    })
    @ApiCreatedResponse({
        description: 'Ativo cadastrado com sucesso.'
    })
    @ApiConflictResponse({
        description: 'Já existe um ativo com esta identificação.'
    })
    async cadastrar(
        @Body(new ZodValidationPipe(createAtivoSchema))
        body: CreateAtivoDTO,
    ) {
        const novoAtivo = await this.createAtivoUseCase.execute(body)

        return AtivoMapper.toHttp(novoAtivo)
    }
}