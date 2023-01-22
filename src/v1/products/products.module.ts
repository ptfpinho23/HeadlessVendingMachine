import { Module } from '@nestjs/common';
import { ProductsRepository } from '../repositories/product.repository';
import { PrismaService } from '../../db/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsValidator } from './products.validator';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsValidator,
    ProductsRepository,
    PrismaService,
    JwtService,
  ],
})
export class ProductsModule {}
