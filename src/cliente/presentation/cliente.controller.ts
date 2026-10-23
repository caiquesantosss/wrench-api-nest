import {
    Controller,
    Post,
    Body,
    UsePipes,
    UseGuards,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard';
import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe';

import { CreateClientUseCase } from '../application/use-cases/create-client-use-case';
import {
    createClientSchema,
    CreateClientDto,
} from '../application/dtos/create-client.dto';

@ApiTags('Clientes e Ativos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClienteController {
    constructor(
        private readonly createClientUseCase: CreateClientUseCase
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
        return this.createClientUseCase.execute(body);
    }
}