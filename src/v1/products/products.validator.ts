import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { Response } from '../../common/response';
import * as joi from 'joi';
import { JoiValidator } from '../../utils/payloadValidator';
import { ProductsRepository } from '../repositories/product.repository';
import { CreateProductDto, ValidatePatchProduct } from './dtos';

@Injectable()
export class ProductsValidator {
  constructor(private readonly productsRepository: ProductsRepository) {}

  validateCreateProduct(
    params: CreateProductDto,
  ): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // Joi Validation
        const joiSchema = joi
          .object({
            name: joi.string().min(3).label('Product Name').required(),
            cost: joi
              .number()
              .positive()
              .min(1)
              .multiple(5)
              .label('Cost')
              .required(),
            amountAvailable: joi
              .number()
              .positive()
              .min(1)
              .label('Amount available')
              .required(),
          })
          .strict();

        // checks the result of validation
        const joiValidationresults = JoiValidator.validate(joiSchema, params);
        if (joiValidationresults)
          return resolve(
            Response.withoutData(HttpStatus.BAD_REQUEST, joiValidationresults),
          );

        // check if product already exist
        const retrievedProduct = await this.productsRepository.getProductByName(
          params.name,
        );
        if (retrievedProduct)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'Product with this name already exists',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validateRemoveProduct(
    sellerId: string,
    productId: string,
  ): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // check if product exist
        const retrievedProduct = await this.productsRepository.getProductById(
          productId,
        );
        if (!retrievedProduct)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'Product with this id does not exist',
            ),
          );

        // check if product belongs to seller
        const doesProductBelongToSeller =
          sellerId === retrievedProduct.sellerId;
        if (doesProductBelongToSeller === false)
          return resolve(
            Response.withoutData(
              HttpStatus.UNAUTHORIZED,
              'You cant remove a product that does not belong to you',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validateRetrieveProduct(productId: string): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // check if product exist
        const retrievedProduct = await this.productsRepository.getProductById(
          productId,
        );
        if (!retrievedProduct)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'Product with this id does not exist',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }

  validatePatchProduct(
    params: ValidatePatchProduct,
  ): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // Joi Validation
        const joiSchema = joi
          .object({
            name: joi.string().min(3).label('Product Name'),
            cost: joi.number().positive().min(1).label('Cost'),
            amountAvailable: joi
              .number()
              .positive()
              .min(1)
              .label('Amount available'),
          })
          .min(1)
          .strict();

        // checks the result of validation
        const joiValidationresults = JoiValidator.validate(
          joiSchema,
          params.data,
        );
        if (joiValidationresults)
          return resolve(
            Response.withoutData(HttpStatus.BAD_REQUEST, joiValidationresults),
          );

        // check if product exist
        const retrievedProduct = await this.productsRepository.getProductById(
          params.productId,
        );
        if (!retrievedProduct)
          return resolve(
            Response.withoutData(
              HttpStatus.BAD_REQUEST,
              'Product with this id does not exist',
            ),
          );

        // check if product belongs to seller
        const doesProductBelongToSeller =
          params.sellerId === retrievedProduct.sellerId;
        if (doesProductBelongToSeller === false)
          return resolve(
            Response.withoutData(
              HttpStatus.UNAUTHORIZED,
              'You do not have update privileges on the select product',
            ),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }
}
