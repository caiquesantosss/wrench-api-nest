import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserRepository } from "../../domain/repositories/UserRepository"
import { Hasher } from "../../../core/cryptography/hasher"

@Injectable()
export class AuthenticateUserUseCase {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,

        @Inject("Hasher")
        private readonly hasher: Hasher,

        private readonly jwtService: JwtService
    ) {}

    async execute(data: {
        email: string
        password: string
    }): Promise<{
        token: string
        perfil: string
        nome: string
    }> {
        const user = await this.userRepository.findByEmail(data.email)

        if (!user) {
            throw new UnauthorizedException("Credenciais inválidas.")
        }

        const isPasswordValid = await this.hasher.compare(
            data.password,
            user.senha_hash
        )

        if (!isPasswordValid) {
            throw new UnauthorizedException("Credenciais inválidas.")
        }

        if (!user.ativo) {
            throw new UnauthorizedException("Usuário inativo.")
        }

        const payload = {
            sub: user.id_usuario,
            perfil: user.perfil,
        }

        const token = await this.jwtService.signAsync(payload)

        return {
            token,
            perfil: user.perfil,
            nome: user.nome,
        }
    }
}