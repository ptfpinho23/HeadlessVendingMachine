import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreateProductDto, UpdateProductDto } from '../products/dtos';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  AddProduct(params: CreateProductDto, sellerId: string): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.prismaService.product.create({
          data: {
            productName: params.name,
            cost: params.cost,
            sellerId,
            amountAvailable: params.amountAvailable,
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  getProductById(productId: string): Promise<Product | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.prismaService.product.findUnique({
          where: {
            id: productId,
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  getProductByName(productName: string): Promise<Product | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.prismaService.product.findUnique({
          where: {
            productName,
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAllproducts(): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await this.prismaService.product.findMany({});

        resolve(products);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateProduct(productId: string, params: UpdateProductDto): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.product.update({
          where: {
            id: productId,
          },
          data: {
            ...params,
          },
        });

        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  removeProduct(productId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.product.delete({
          where: {
            id: productId,
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  decreaseProductStock(productId: string, amount: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.product.update({
          where: {
            id: productId,
          },
          data: {
            amountAvailable: { decrement: amount },
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }
}
