import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PurchaseService } from './purchase.service';
import { PurchaseValidator } from './purchase.validator';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { PurchaseController } from './purchase.controller';
import { PrismaService } from '../../db/prisma.service';
import { UsersRepository } from '../repositories/user.repository';
import { ProductsRepository } from '../repositories/product.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, ProductsModule, UsersModule],
  controllers: [PurchaseController],
  providers: [
    PurchaseService,
    PurchaseValidator,
    PrismaService,
    UsersRepository,
    ProductsRepository,
    JwtService,
  ],
})
export class PurchaseModule {}
