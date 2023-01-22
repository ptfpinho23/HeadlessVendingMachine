import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../config/config';
import { PrismaService } from '../../db/prisma.service';
import { SESSION_TTL } from '../../common/constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../repositories/user.repository';
import { LocalStrategy } from './strategy/local.strategy';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env,
      ttl: SESSION_TTL,
    }),
    PassportModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: SESSION_TTL,
      },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    AuthService,
    PrismaService,
    JwtStrategy,
    UsersRepository,
    LocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
