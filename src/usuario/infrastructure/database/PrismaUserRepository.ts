import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { User } from '../../domain/entities/User'
import { UserRepository } from '../../domain/repositories/UserRepository'

@Injectable() 
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) return null;

    return User.recover(
      user.id_usuario,
      user.nome,
      user.email,
      user.senha_hash,
      user.perfil,
      user.ativo
    );
  }

  async save(usuario: User): Promise<User> {
    const user = await this.prisma.usuario.create({
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senha_hash: usuario.senha_hash,
        perfil: usuario.perfil,
        ativo: usuario.ativo,
      },
    });

    return User.recover(
      user.id_usuario,
      user.nome,
      user.email,
      user.senha_hash,
      user.perfil,
      user.ativo
    );
  }
}