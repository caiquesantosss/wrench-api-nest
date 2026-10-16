import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user-use-case';
import { ZodValidationPipe } from '../shared/pipes/zod-validation-pipe';
import { CreateUserDTO, createUserSchema } from './dtos/create-user-dto';
import { AuthenticateUserDTO, authenticateUserSchema } from './dtos/authenticate-user-dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth-guard';
import { LoggedUser } from '../shared/decorators/logged-user-decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Utilizadores')
@Controller('users')
export class UsuarioController {
    authenticateUserUseCase: any;
    constructor(private criarUsuarioUseCase: CreateUserUseCase) { }

    @Post('register')
    @UsePipes(new ZodValidationPipe(createUserSchema))
    async registrar(@Body() body: CreateUserDTO) {
        const usuario = await this.criarUsuarioUseCase.execute(body)
        return usuario
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Autenticar utilizador e gerar token JWT' })
    @UsePipes(new ZodValidationPipe(authenticateUserSchema))
    async login(@Body() body: AuthenticateUserDTO) {
        return await this.authenticateUserUseCase.execute(body)
    }

    @Get('me')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obter dados do utilizador atualmente logado' })
    @UseGuards(JwtAuthGuard)
    async me(@LoggedUser() currentUser: any) {
        return {
            mensagem: 'Acesso autorizado!',
            dados_do_token: currentUser
        };
    }
}