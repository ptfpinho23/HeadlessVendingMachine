import { CACHE_MANAGER, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {
        super()
    }

    async canActivate(context: ExecutionContext): Promise<any> {

        const request = context.switchToHttp().getRequest()
        const authToken = request.headers.authorization
        const jwt = authToken.split(" ")[1]

        // Check for cached sessions
        const cachedSessions = await this.cacheService.get(`*${jwt}*`) as string[]
        if (cachedSessions.length === 0) return false

        return super.canActivate(context);
    }
}
