import { Inject, Injectable } from "@nestjs/common";
import { FinanceiroRepository } from "../../domain/repositories/FinanceiroRepository";
import { FinanceiroResponseDTO } from "../dtos/list-all-os.dto";

@Injectable()
export class ListAllFinanceiroWithOSUseCase {
    constructor(
        @Inject('FinanceiroRepository')
        private readonly financeiroRepository: FinanceiroRepository
    ) {}

    async execute(): Promise<FinanceiroResponseDTO[]> {
        return this.financeiroRepository.listAllWithOS()
    }
}