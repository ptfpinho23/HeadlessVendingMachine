import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersValidator } from './users.validator';
import { UsersController } from './users.controller';
import { UsersService } from './users.sevice';
import { UsersRepository } from '../repositories/user.repository';
import { PrismaService } from '../../db/prisma.service';
import { DepositService } from './deposit.service';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    DepositService,
    UsersValidator,
    UsersRepository,
    PrismaService,
  ],
})
export class UsersModule {}
