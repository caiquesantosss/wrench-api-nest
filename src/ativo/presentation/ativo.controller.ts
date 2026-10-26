import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Get,
    UseGuards,
    Param,
    ParseIntPipe,
    Patch,
    Put
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiConflictResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiParam, 
    ApiBadRequestResponse
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe'

import { LoggedUser } from '../../shared/decorators/logged-user-decorator'
import { CreateAtivoDTO, createAtivoSchema } from '../application/dtos/create-ativo.dto'
import { UpdateAtivoDTO, updateAtivoSchema } from '../application/dtos/update-details-ativo.dto'
import { AtivoMapper } from './mappers/ativo.mapper'

import { CreateAtivoUseCase } from '../application/use-cases/create-ativo-use-case'
import { FindAtivoUseCase } from '../application/use-cases/find-ativo-use-case'
import { ListAtivoUseCase } from '../application/use-cases/list-ativo-use-case'
import { ToggleAtivoStatusUseCase } from '../application/use-cases/toggle-ativo-status-use-case'
import { UpdateDetailsAtivoUseCase } from '../application/use-cases/update-details-ativo-use-case'

@ApiTags('Ativos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ativos')
export class AtivoController {
    constructor(
        private readonly createAtivoUseCase: CreateAtivoUseCase,
        private readonly findAtivoUseCase: FindAtivoUseCase,
        private readonly listAtivoUseCase: ListAtivoUseCase,
        private readonly toggleAtivoStatusUseCase: ToggleAtivoStatusUseCase, 
        private readonly updateDetailsAtivoUseCase: UpdateDetailsAtivoUseCase
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
    async create(
        @Body(new ZodValidationPipe(createAtivoSchema))
        body: CreateAtivoDTO,
    ) {
        const novoAtivo = await this.createAtivoUseCase.execute(body)

        return AtivoMapper.toHttp(novoAtivo)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Buscar um ativo por ID',
        description: 'Retorna os detalhes de um veículo ou máquina específico.'
    })
    @ApiOkResponse({ description: 'Ativo encontrado com sucesso.' })
    @ApiNotFoundResponse({ description: 'Ativo não encontrado.' })
    async buscarPorId(
        @Param('id', ParseIntPipe) id: number,
    ) {
        const ativo = await this.findAtivoUseCase.execute(id)

        return AtivoMapper.toHttp(ativo)
    }

    @Get('meus-ativos')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Listar ativos do utilizador autenticado' })
    async listarMeusAtivos(
        @LoggedUser('sub') idClienteLogado: number,
    ) {
        const ativos = await this.listAtivoUseCase.execute(idClienteLogado)
        return ativos.map(ativo => AtivoMapper.toHttp(ativo))
    }

    @Patch(':id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Alternar status do ativo',
        description: 'Ativa um veículo inativo ou inativa um veículo ativo (Toggle).'
    })
    @ApiOkResponse({ description: 'Status do ativo alterado com sucesso.' })
    @ApiNotFoundResponse({ description: 'Ativo não encontrado.' })
    async alternarStatus(
        @Param('id', ParseIntPipe) id: number,
    ) {
        const ativoAtualizado = await this.toggleAtivoStatusUseCase.execute(id)

        return AtivoMapper.toHttp(ativoAtualizado)
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Atualizar os detalhes de um ativo',
        description:
            'Atualiza os dados cadastrais de um ativo existente, incluindo descrição, tipo, marca, modelo, identificação e observações.',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Identificador único do ativo.',
        example: 1,
    })
    @ApiBody({
        description: 'Dados para atualização do ativo.',
        schema: {
            example: {
                descricao: 'Compressor industrial',
                tipo: 'MAQUINA',
                marca: 'Schulz',
                modelo: 'SRP 3030',
                identificacao: 'COMP-001',
                observacoes: 'Equipamento revisado e em boas condições.',
            },
        },
    })
    @ApiOkResponse({
        description: 'Ativo atualizado com sucesso.',
        schema: {
            example: {
                id_ativo: 1,
                id_cliente: 2,
                descricao: 'Compressor industrial',
                tipo: 'MAQUINA',
                marca: 'Schulz',
                modelo: 'SRP 3030',
                identificacao: 'COMP-001',
                observacoes: 'Equipamento revisado e em boas condições.',
                ativo: true,
                data_cadastro: '2026-10-26T10:30:00.000Z',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Nenhum ativo foi encontrado com o identificador informado.',
    })
    @ApiConflictResponse({
        description: 'Já existe outro ativo cadastrado com essa identificação.',
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos ou identificador em formato incorreto.',
    })
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(updateAtivoSchema))
        body: UpdateAtivoDTO,
    ) {
        const ativoAtualizado =
            await this.updateDetailsAtivoUseCase.execute(id, body)

        return AtivoMapper.toHttp(ativoAtualizado)
    }

}