import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY, 
            [context.getHandler(), context.getClass()]
        )

        if (!roles)  {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user

        return !!user && roles.includes(user.role)
    }
}