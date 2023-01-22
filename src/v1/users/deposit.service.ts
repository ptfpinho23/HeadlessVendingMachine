import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import { ResponseWithData } from '../../common/entities/response.entity';
import { CreateDepositDto } from './dto';
import { UsersRepository } from '../repositories/user.repository';
import { UsersValidator } from './users.validator';
import { getErrorResponse } from '../../common/error';

@Injectable()
export class DepositService {
  constructor(
    private readonly usersValidator: UsersValidator,
    private readonly usersRepository: UsersRepository,
  ) {}

  async deposit(
    buyerId: string,
    params: CreateDepositDto,
  ): Promise<ResponseWithData> {
    try {
      // validate retrieve user
      const validationResults: any = await this.usersValidator.validateDeposit(
        params,
        buyerId,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // reset buyer deposit
      await this.usersRepository.incrementDeposit(buyerId, params.amount);

      // success
      return Response.withoutData(
        HttpStatus.OK,
        'Deposit Processed Successfully',
      );
    } catch (error) {
      logger.error(
        `An error occurred while depositing coins for user: ${error}`,
      );
      return getErrorResponse(error);
    }
  }

  async resetDeposit(buyerId: string): Promise<ResponseWithData> {
    try {
      // validate retrieve user
      const validationResults: any =
        await this.usersValidator.validateResetDeposit(buyerId);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // reset buyer deposit
      await this.usersRepository.resetDeposit(buyerId);

      // success
      return Response.withoutData(HttpStatus.OK, 'Deposit Reset Successfully');
    } catch (error) {
      logger.error(
        `An error occurred while reseting deposit for user: ${error}`,
      );
      return getErrorResponse(error);
    }
  }
}
