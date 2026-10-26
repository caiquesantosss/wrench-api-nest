import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { User } from '../../domain/entities/User'
import { UserRepository } from '../../domain/repositories/UserRepository'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.usuario.findUnique({
      where: { email },
    })

    if (!prismaUser) return null
    return this.mapToDomainUser(prismaUser)
  }

  async save(user: User): Promise<User> {
    const createdPrismaUser = await this.prisma.usuario.create({
      data: {
        nome: user.nome,
        email: user.email,
        senha_hash: user.senha_hash,
        perfil: user.perfil,
        ativo: user.ativo,
      },
    })

    return this.mapToDomainUser(createdPrismaUser)
  }

  private mapToDomainUser(prismaData: any): User {
    return User.recover(
      prismaData.id_usuario,
      prismaData.nome,
      prismaData.email,
      prismaData.senha_hash,
      prismaData.perfil,
      prismaData.ativo
    )
  }
}