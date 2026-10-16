import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { UserRepository } from "../../domain/repositories/UserRepository"
import { User } from "../../domain/entities/User"
import { CreateUserDTO } from "../../presentation/dtos/create-user-dto"
import bcrypt from "bcryptjs"
import { Hasher } from "../../../core/cryptography/hasher"

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository,

        @Inject("Hasher")
        private readonly hasher: Hasher
    ) { }

    async execute(userData: CreateUserDTO): Promise<Omit<User, "senha_hash">> {
        const existingUser = await this.userRepository.findByEmail(userData.email)

        if (existingUser) {
            throw new BadRequestException("User with this email already exists.")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await this.hasher.hash(userData.senha)

        const newUser = User.create(
            userData.nome,
            userData.email,
            hashedPassword,
            userData.perfil
        )

        const savedUser = await this.userRepository.save(newUser)

        const { senha_hash, ...userWithoutPassword } = savedUser

        return userWithoutPassword as Omit<User, "senha_hash">
    }
}