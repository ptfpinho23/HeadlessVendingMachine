import Joi from 'joi';
import { config } from '../config/config';

export class JoiValidator {
  static validate(
    joiSchema: Joi.ObjectSchema<any>,
    paramsToValidate: any,
  ): string | null {
    const { error } = joiSchema.validate(paramsToValidate, config.joiOptions);

    return error ? error.details[0].message : null;
  }
}
