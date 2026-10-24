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
    Query
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
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe'

import { CreateAtivoDTO, createAtivoSchema } from '../application/dtos/create-ativo.dto'
import { AtivoMapper } from './mappers/ativo.mapper'

import { CreateAtivoUseCase } from '../application/use-cases/create-ativo-use-case'
import { FindAtivoUseCase } from '../application/use-cases/find-ativo-use-case'
import { ListAtivoUseCase } from '../application/use-cases/list-ativo-use-case'
import { ListAtivosDTO, listAtivosSchema } from '../application/dtos/list-ativos.dto'
import { LoggedUser } from '../../shared/decorators/logged-user-decorator'

@ApiTags('Ativos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ativos')
export class AtivoController {
    constructor(
        private readonly createAtivoUseCase: CreateAtivoUseCase,
        private readonly findAtivoUseCase: FindAtivoUseCase,
        private readonly listAtivoUseCase: ListAtivoUseCase
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
        const ativos = await this.listAtivoUseCase.execute(idClienteLogado);
        return ativos.map(ativo => AtivoMapper.toHttp(ativo));
    }
}