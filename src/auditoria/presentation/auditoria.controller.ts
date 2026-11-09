
import {
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common'

import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'

import { FindLogAuditoriaByIdUseCase } from '../application/use-cases/find-log-auditoria-by-id.use-case'
import { ListAllLogAuditoriaWithUserUseCase } from '../application/use-cases/list-all-log-auditoria-with-user.use-case'

@ApiTags('Auditoria')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('auditoria')
export class AuditoriaController {
    constructor(
        private readonly findLogAuditoriaByIdUseCase: FindLogAuditoriaByIdUseCase,
        private readonly listAllLogAuditoriaWithUserUseCase: ListAllLogAuditoriaWithUserUseCase
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Listar registros de auditoria',
        description: 'Retorna todos os registros de auditoria, incluindo os dados do usuário responsável por cada operação.'
    })
    @ApiOkResponse({
        description: 'Registros de auditoria retornados com sucesso.'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido.'
    })
    async listarTodos() {
        return this.listAllLogAuditoriaWithUserUseCase.execute()
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Buscar registro de auditoria por ID',
        description: 'Retorna os detalhes de um registro específico de auditoria.'
    })
    @ApiParam({
        name: 'id',
        description: 'Identificador do registro de auditoria.',
        type: Number,
        example: 1
    })
    @ApiOkResponse({
        description: 'Registro de auditoria encontrado com sucesso.'
    })
    @ApiNotFoundResponse({
        description: 'Registro de auditoria não encontrado.'
    })
    @ApiUnauthorizedResponse({
        description: 'Token JWT ausente ou inválido.'
    })
    async buscarPorId(
        @Param('id', ParseIntPipe) id: number
    ) {
        const log = await this.findLogAuditoriaByIdUseCase.execute(id)

        if (!log) {
            throw new NotFoundException('Registro de auditoria não encontrado.')
        }

        return log
    }
}
