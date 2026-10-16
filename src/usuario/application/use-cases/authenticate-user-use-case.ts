import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticateUserUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
        private readonly JwtService: JwtService
    ) { }

    async execute(data: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        perfil: string;
        nome: string;
    }> {
        const user = await this.userRepository.findByEmail(data.email)

        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado')
        }

        const isPasswordValid = await this.userRepository.comparePassword(data.password, user.senha_hash)

        if (!isPasswordValid) {
            throw new UnauthorizedException('Senha inválida')
        }

        const payload = {
            sub: user.id_usuario,
            perfil: user.perfil,
        }

        const token = this.JwtService.sign(payload)

        return {
            token,
            perfil: user.perfil,
            nome: user.nome,
        }
    }
}