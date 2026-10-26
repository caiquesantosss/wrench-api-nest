
import {
    Controller,
    Post,
    Body,
    UsePipes,
    HttpCode,
    HttpStatus,
    UseGuards,
    Get,
} from '@nestjs/common'

import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger'

import { CreateUserUseCase } from '../application/use-cases/create-user-use-case'
import { AuthenticateUserUseCase } from '../application/use-cases/authenticate-user-use-case'

import { ZodValidationPipe } from '../../shared/pipes/zod-validation-pipe'

import {
    CreateUserDTO,
    createUserSchema,
} from '../application/dtos/create-user.dto'

import {
    AuthenticateUserDTO,
    authenticateUserSchema,
} from '../application/dtos/authenticate-user.dto'

import { JwtAuthGuard } from '../../shared/guards/jwt-auth-guard'
import { LoggedUser } from '../../shared/decorators/logged-user-decorator'

@ApiTags('Utilizadores')
@Controller('users')
export class UsuarioController {
    constructor(
        private readonly criarUsuarioUseCase: CreateUserUseCase,
        private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    ) {}

    @Post('register')
    @ApiOperation({
        summary: 'Cadastrar novo utilizador',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nome: {
                    type: 'string',
                    example: 'João Silva',
                },
                email: {
                    type: 'string',
                    example: 'joao@email.com',
                },
                senha: {
                    type: 'string',
                    example: 'Senha123!',
                },
                perfil: {
                    type: 'string',
                    enum: [
                        'ATENDENTE',
                        'MECANICO',
                        'FUNILEIRO',
                        'ALMOXARIFE',
                        'FINANCEIRO',
                        'GERENTE',
                    ],
                    example: 'ATENDENTE',
                },
            },
            required: ['nome', 'email', 'senha', 'perfil'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Utilizador cadastrado com sucesso',
    })
    @UsePipes(new ZodValidationPipe(createUserSchema))
    async registrar(@Body() body: CreateUserDTO) {
        return this.criarUsuarioUseCase.execute(body)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Autenticar utilizador e gerar token JWT',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'joao@email.com',
                },
                senha: {
                    type: 'string',
                    example: 'Senha123!',
                },
            },
            required: ['email', 'senha'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Autenticação realizada com sucesso',
    })
    @UsePipes(new ZodValidationPipe(authenticateUserSchema))
    async login(@Body() body: AuthenticateUserDTO) {
        return this.authenticateUserUseCase.execute(body)
    }

    @Get('me')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Obter dados do utilizador atualmente logado',
    })
    @ApiResponse({
        status: 200,
        description: 'Dados do utilizador autenticado retornados com sucesso',
    })
    @ApiResponse({
        status: 401,
        description: 'Token ausente ou inválido',
    })
    @UseGuards(JwtAuthGuard)
    async me(@LoggedUser() currentUser: any) {
        return {
            mensagem: 'Acesso autorizado!',
            dados_do_token: currentUser,
        }
    }
}
