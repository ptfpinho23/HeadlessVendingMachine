import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { UsersRepository } from '../repositories/user.repository';
import { PurchaseValidator } from './purchase.validator';
import { ProductsRepository } from '../repositories/product.repository';
import { PurchaseProductDto } from './dtos';
import { getErrorResponse } from '../../common/error';
import { AVAILABLE_COINS } from '../../common/constants';
import { changeCalculator } from '../../common/utils/coins';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly usersValidator: PurchaseValidator,
    private readonly usersRepository: UsersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async buyProduct(
    params: PurchaseProductDto,
    userId: string,
  ): Promise<ResponseWithoutData> {
    try {
      // validate create user params
      const validationResults = await this.usersValidator.validateBuyProduct(
        params,
      );

      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // retrieve Product
      const product = await this.productsRepository.getProductById(
        params.productId,
      );

      if (!product) return Response.withoutData(HttpStatus.NOT_FOUND, '');

      // check if amountOfProduct is greater than product amount available
      const purchaseCoinsCheck =
        product.amountAvailable >= params.amountOfProduct;
      if (purchaseCoinsCheck === false)
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'Not enough stock for the amount entered',
        );

      // calculate total amount to be spent
      const subTotal: number = product.cost * params.amountOfProduct;

      // check user deposit
      const user = await this.usersRepository.getUserById(userId);
      if (!user) {
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          'User does not exist',
        );
      }

      const doesUserHaveEnoughDepositToBuyProduct = user.deposits >= subTotal;

      if (doesUserHaveEnoughDepositToBuyProduct === false)
        return Response.withoutData(
          HttpStatus.BAD_REQUEST,
          `Insufficient deposit to purchase ${product.productName}`,
        );

      // calculate change
      const change = user.deposits - subTotal;
      const changeInCoins: number[] = changeCalculator(AVAILABLE_COINS, change);

      // decrease product Amount available
      await Promise.all([
        await this.productsRepository.decreaseProductStock(
          params.productId,
          params.amountOfProduct,
        ),
        await this.usersRepository.resetDeposit(userId)
      ])

      // success
      return Response.withData(
        HttpStatus.CREATED,
        'Thanks for your Purchase!',
        {
          sub_total: subTotal,
          product: product.productName,
          total_change: change,
          Change: changeInCoins,
        },
      );
    } catch (error) {
      logger.error(`An error occurred while buying product ${error}`);
      return getErrorResponse(error);
    }
  }
}
