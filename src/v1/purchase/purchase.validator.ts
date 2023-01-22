import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { Response } from '../../common/response';
import * as joi from 'joi';
import { JoiValidator } from '../../utils/payloadValidator';
import { PurchaseProductDto } from './dtos';

@Injectable()
export class PurchaseValidator {
  validateBuyProduct(params: PurchaseProductDto): Promise<ResponseWithoutData> {
    return new Promise(async (resolve, reject) => {
      try {
        // Joi Validation
        const joiSchema = joi
          .object({
            productId: joi.string().label('Product Id').required(),
            amountOfProduct: joi
              .number()
              .positive()
              .min(1)
              .label('Amount of product')
              .required(),
          })
          .strict();

        // checks the result of validation
        const joiValidationresults = JoiValidator.validate(joiSchema, params);
        if (joiValidationresults)
          return resolve(
            Response.withoutData(HttpStatus.BAD_REQUEST, joiValidationresults),
          );

        // success
        resolve(Response.withoutData(HttpStatus.OK, 'Passed'));
      } catch (error) {
        reject(error);
      }
    });
  }
}
