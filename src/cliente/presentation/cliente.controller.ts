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

import { CreateClientUseCase } from '../application/use-cases/create-client-use-case'
import {
    createClientSchema,
    CreateClientDto,
} from '../application/dtos/create-client.dto'
import { ListAllClientsUseCase } from '../application/use-cases/list-all-clients-use-case'
import { FindCLientById } from '../application/use-cases/find-client-by-id-use-case'
import { ClienteMapper } from './mappers/cliente.mapper'

@ApiTags('Clientes e Ativos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClienteController {
    constructor(
        private readonly createClientUseCase: CreateClientUseCase,
        private readonly listAllClientsUseCase: ListAllClientsUseCase,
        private readonly findCLientByIdUseCase: FindCLientById
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
    async cadastrarCliente(@Body() body: CreateClientDto) {
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
        const cliente = await this.findCLientByIdUseCase.execute(id)

        return ClienteMapper.toHttp(cliente)
    }
}