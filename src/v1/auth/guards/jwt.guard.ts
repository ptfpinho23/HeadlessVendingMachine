import {
  CACHE_MANAGER,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { jwtPayload } from '../../../common/interfaces';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;

    if (!authToken) {
      return false;
    }
    const jwt = authToken.split(' ')[1];
    const decodedJwt = this.jwtService.decode(jwt);

    if (!decodedJwt) {
      return false;
    }

    // Check for cached user session
    const cachedSessions = (await this.cacheService.get(
      (decodedJwt as jwtPayload).username,
    )) as string;

    if (!cachedSessions) return false;

    return super.canActivate(context);
  }
}
