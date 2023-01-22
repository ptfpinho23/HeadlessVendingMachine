import {
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResponseWithData } from '../../common/entities/response.entity';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import { UsersRepository } from '../repositories/user.repository';
import { Request } from 'express';
import { LoginDto } from './dto/auth.dto';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../db/prisma.service';
import { User } from '@prisma/client';
import { getErrorResponse } from '../../common/error';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const validatePassword = await bcrypt.compare(pass, user.password);
    if (user && validatePassword) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(loginDto: LoginDto, req: Request): Promise<ResponseWithData> {
    try {
      const { username, password } = loginDto;

      const user = await this.prismaService.user.findUnique({
        where: { username },
      });

      if (!user) {
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          `Invalid Credentials`,
        );
      }

      const validatePassword = await bcrypt.compare(password, user.password);

      if (!validatePassword) {
        throw new UnauthorizedException(`Incorrect Password`);
      }

      // check if active session exist for user
      const cachedSessionData = await this.cacheService.get(user.username);

      if (cachedSessionData) {
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          "There's already an active session",
        );
      }

      const jwt = this.jwtService.sign({
        username,
      });

      // set keys to redis
      await this.cacheService.set(user.username, JSON.stringify(req.user));

      return Response.withData(HttpStatus.OK, '', {
        token: jwt,
      });
    } catch (error) {
      logger.error(`An error occurred while logging in. Error:${error}`);
      return getErrorResponse(error);
    }
  }

  async logoutActiveSessions(user: User): Promise<ResponseWithData> {
    try {
      // delete cached session
      await this.cacheService.del(user.username);

      return Response.withoutData(HttpStatus.OK, 'Active Session Terminated');
    } catch (error) {
      logger.error(`An error occured while attempting to logout - ${error}`);
      return getErrorResponse(error);
    }
  }
}
