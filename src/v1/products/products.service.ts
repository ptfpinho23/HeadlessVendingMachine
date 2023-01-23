import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import {
  ResponseWithData,
  ResponseWithoutData,
} from '../../common/entities/response.entity';
import { ProductsValidator } from './products.validator';
import { ProductsRepository } from '../repositories/product.repository';
import { CreateProductDto, ProductEgressDto, UpdateProductDto } from './dtos';
import { getErrorResponse } from '../../common/error';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productValidator: ProductsValidator,
    private readonly productRepository: ProductsRepository,
  ) {}

  async addProduct(
    params: CreateProductDto,
    sellerId: string,
  ): Promise<ResponseWithoutData> {
    try {
      // validate create product params
      const validationResults =
        await this.productValidator.validateCreateProduct(params);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // save product
      await this.productRepository.AddProduct(
        {
          cost: params.cost,
          name: params.name,
          amountAvailable: params.amountAvailable,
        },
        sellerId,
      );

      // success
      return Response.withoutData(
        HttpStatus.CREATED,
        'Product saved successfully',
      );
    } catch (error) {
      logger.error(`An error occurred while saving product: ${error}`);
      return getErrorResponse(error);
    }
  }

  async getAllProducts(): Promise<ResponseWithData> {
    try {
      // retrieve all products
      const products = await this.productRepository.getAllproducts();

      return Response.withData(
        HttpStatus.OK,
        'Products retrieved successfully',
        products.map((product) => {
          return new ProductEgressDto(
            product.id,
            product.productName,
            product.amountAvailable,
            product.cost
          );
        }),
      );
    } catch (error) {
      logger.error(`An error occurred while retrieving product: ${error}`);
      return getErrorResponse(error);
    }
  }

  async updateProduct(
    sellerId: string,
    data: UpdateProductDto,
    productId: string,
  ): Promise<ResponseWithData> {
    try {
      // validate update product
      const validationResults =
        await this.productValidator.validatePatchProduct({
          data,
          productId,
          sellerId,
        });
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // update product
      await this.productRepository.updateProduct(productId, data);

      // success
      return Response.withoutData(
        HttpStatus.OK,
        'Product updated successfully',
      );
    } catch (error) {
      logger.error(`An error occurred while updating product: ${error}`);
      return getErrorResponse(error);
    }
  }

  async deleteProduct(
    sellerId: string,
    productId: string,
  ): Promise<ResponseWithData> {
    try {
      // validate delete product
      const validationResults =
        await this.productValidator.validateRemoveProduct(sellerId, productId);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // delete product
      await this.productRepository.removeProduct(productId);

      // success
      return Response.withoutData(
        HttpStatus.OK,
        'Product deleted successfully',
      );
    } catch (error) {
      logger.error(`An error occurred while deleting product: ${error}`);
      return getErrorResponse(error);
    }
  }

  async getProduct(productId: string): Promise<ResponseWithData> {
    try {
      // validate update product
      const validationResults =
        await this.productValidator.validateRetrieveProduct(productId);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // retrieve product
      const product = await this.productRepository.getProductById(productId);

      if (!product) {
        return Response.withoutData(
          HttpStatus.NOT_FOUND,
          `Could not find product - ${productId}`,
        );
      }

      // success
      return Response.withData(
        HttpStatus.OK,
        'Product retrieved successfully',
        new ProductEgressDto(
          product.id,
          product.productName,
          product.amountAvailable,
          product.cost
        ),
      );
    } catch (error) {
      logger.error(`An error occurred while getting product: ${error}`);
      return getErrorResponse(error);
    }
  }
}
