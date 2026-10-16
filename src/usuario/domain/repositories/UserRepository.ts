import { User } from "../entities/User"

export interface UserRepository {
    comparePassword(password: string, password1: any): unknown
    findByEmail(email: string): Promise<User | null>
    save(user: User): Promise<User>
}