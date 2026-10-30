import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { RequestContext } from "../../context/request-context";

@Injectable()
export class ContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()

        const userId = request.user?.sub ? Number(request.user.sub) : undefined

        return RequestContext.run({ userId }, () => {
            return next.handle()
        })
    }
}