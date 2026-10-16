import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user-use-case';
import { ZodValidationPipe } from '../shared/pipes/zod-validation-pipe';
import { CreateUserDTO, createUserSchema } from './dtos/create-user-dto';
import { AuthenticateUserDTO, authenticateUserSchema } from './dtos/authenticate-user-dto';

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
    @UsePipes(new ZodValidationPipe(authenticateUserSchema))
    async login(@Body() body: AuthenticateUserDTO) {
        return await this.authenticateUserUseCase.execute(body)
    }
}