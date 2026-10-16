import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user-use-case';
import { ZodValidationPipe } from '../shared/pipes/zod-validation-pipe';
import { CreateUserDTO, CreateUserSchema } from './dtos/create-user-dto';

@Controller('users')
export class UsuarioController {
    constructor(private criarUsuarioUseCase: CreateUserUseCase) { }

    @Post('register')
    @UsePipes(new ZodValidationPipe(CreateUserSchema))
    async registrar(@Body() body: CreateUserDTO) {
        const usuario = await this.criarUsuarioUseCase.execute(body)

        return usuario
    }
}