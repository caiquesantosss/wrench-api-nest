import {
    Controller,
    Post,
    Body,
    UsePipes,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch
} from '@nestjs/common'

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBody,
    ApiResponse,
    ApiOkResponse,
    ApiParam,
    ApiNotFoundResponse
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe'
import { ClienteMapper } from './mappers/cliente.mapper'
import {
    createClientSchema,
    CreateClientDTO,
} from '../application/dtos/create-client.dto'

import { CreateClientUseCase } from '../application/use-cases/create-client-use-case'
import { ListAllClientsUseCase } from '../application/use-cases/list-all-clients-use-case'
import { FindCLientById } from '../application/use-cases/find-client-by-id-use-case'
import { UpdateClientUseCase } from '../application/use-cases/update-client-use-case'
import { ToggleStatusClientUseCase } from '../application/use-cases/toggle-status-client-use-case'

@ApiTags('Clientes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClienteController {
    constructor(
        private readonly createClientUseCase: CreateClientUseCase,
        private readonly listAllClientsUseCase: ListAllClientsUseCase,
        private readonly findClientByIdUseCase: FindCLientById,
        private readonly updateClientUseCase: UpdateClientUseCase, 
        private readonly toggleStatusClientUseCase: ToggleStatusClientUseCase
    ) { }

    @Post()
    /* @Roles('ATENDENTE')
    @UseGuards(RoleGuard) */
    @ApiOperation({
        summary: 'Cadastrar um novo cliente',
    })
    @ApiBody({
        description: 'Dados necessários para cadastrar um cliente.',
        schema: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string',
                    example: 'Maria Antonia',
                },
                documento: {
                    type: 'string',
                    example: '12345678909',
                },
                telefone: {
                    type: 'string',
                    example: '11987654321',
                },
                email: {
                    type: 'string',
                    example: 'maria@email.com',
                },
                endereco: {
                    type: 'string',
                    example: 'Rua das Flores, 123',
                },
            },
            required: [
                'nome',
                'documento',
                'telefone',
                'email',
                'endereco',
            ],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Cliente cadastrado com sucesso.',
    })
    @ApiResponse({
        status: 400,
        description: 'Dados inválidos ou documento já cadastrado.',
    })
    @UsePipes(new ZodValidationPipe(createClientSchema))
    async cadastrarCliente(@Body() body: CreateClientDTO) {
        return this.createClientUseCase.execute(body)
    }

    @Get()
    @ApiOperation({
        summary: 'Listar todos os clientes',
        description: 'Retorna a lista de clientes cadastrados no sistema, ordenada pelo nome.',
    })
    @ApiOkResponse({
        description: 'Lista de clientes retornada com sucesso.',
        schema: {
            example: [
                {
                    id_cliente: 1,
                    nome: 'Maria Antonia',
                    telefone: '11987654321',
                    email: 'maria@email.com',
                    documento: '12345678909',
                    endereco: 'Rua das Flores, 123',
                    ativo: true,
                    data_cadastro: '2026-10-26T18:00:00.000Z',
                },
                {
                    id_cliente: 2,
                    nome: 'João da Silva',
                    telefone: '11912345678',
                    email: 'joao@email.com',
                    documento: '98765432100',
                    endereco: 'Avenida Central, 500',
                    ativo: false,
                    data_cadastro: '2026-10-25T14:30:00.000Z',
                },
            ],
        },
    })
    async listarTodos() {
        const clientes = await this.listAllClientsUseCase.execute()

        return clientes.map((cliente) => ClienteMapper.toHttp(cliente))
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Buscar cliente por ID',
        description: 'Retorna os dados de um cliente específico a partir do seu identificador.',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Identificador único do cliente.',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Cliente encontrado com sucesso.',
        schema: {
            example: {
                id_cliente: 1,
                nome: 'Maria Antonia',
                telefone: '11987654321',
                email: 'maria@email.com',
                documento: '12345678909',
                endereco: 'Rua das Flores, 123',
                ativo: true,
                data_cadastro: '2026-10-26T18:00:00.000Z',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Cliente não encontrado para o identificador informado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'O cliente não pode ser encontrado',
                error: 'Not Found',
            },
        },
    })
    async buscarPorId(
        @Param('id', ParseIntPipe) id: number,
    ) {
        const cliente = await this.findClientByIdUseCase.execute(id)

        return ClienteMapper.toHttp(cliente)
    }


    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Atualizar os dados de um cliente',
        description: 'Atualiza nome, documento, telefone, e-mail e endereço de um cliente cadastrado.',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Identificador único do cliente.',
        example: 1,
    })
    @ApiBody({
        description: 'Dados para atualização do cliente.',
        schema: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string',
                    example: 'Maria Antonia da Silva',
                },
                documento: {
                    type: 'string',
                    example: '52998224725',
                },
                telefone: {
                    type: 'string',
                    example: '11987654321',
                },
                email: {
                    type: 'string',
                    example: 'maria.silva@email.com',
                },
                endereco: {
                    type: 'string',
                    example: 'Avenida Paulista, 1000',
                },
            },
            required: ['nome', 'documento'],
        },
    })
    @ApiOkResponse({
        description: 'Cliente atualizado com sucesso.',
        schema: {
            example: {
                id_cliente: 1,
                nome: 'Maria Antonia da Silva',
                documento: '52998224725',
                telefone: '11987654321',
                email: 'maria.silva@email.com',
                endereco: 'Avenida Paulista, 1000',
                ativo: true,
                data_cadastro: '2026-10-26T18:00:00.000Z',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Cliente não encontrado para o identificador informado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Cliente não foi encontrado.',
                error: 'Not Found',
            },
        },
    })
    async atualizarCliente(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateClientDTO,
    ) {
        const cliente = await this.updateClientUseCase.execute(id, body)

        return ClienteMapper.toHttp(cliente)
    }

    @Patch(':id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Ativar ou desativar um cliente',
        description:
            'Alterna o status do cliente. Se estiver ativo, será desativado; se estiver inativo, será ativado.',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        description: 'Identificador único do cliente.',
        example: 1,
    })
    @ApiOkResponse({
        description: 'Status do cliente alterado com sucesso.',
        schema: {
            example: {
                id_cliente: 1,
                nome: 'Maria Antonia',
                telefone: '11987654321',
                email: 'maria@email.com',
                documento: '12345678909',
                endereco: 'Rua das Flores, 123',
                ativo: false,
                data_cadastro: '2026-10-26T18:00:00.000Z',
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Cliente não encontrado para o identificador informado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Não foi possível encontrar um ativo.',
                error: 'Not Found',
            },
        },
    })
    async alternarStatusCliente(
        @Param('id', ParseIntPipe) id: number,
    ) {
        const cliente = await this.toggleStatusClientUseCase.execute(id)

        return ClienteMapper.toHttp(cliente)
    }
}