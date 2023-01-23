import {
  HttpStatus,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { Response } from '../../common/response';
import logger from '../../utils/logger';
import {
  ResponseWithData,
  ResponseWithoutData,
} from '../../common/entities/response.entity';
import {
  CreateDepositDto,
  CreateUserDto,
  UpdateUserDto,
  UserEgressDto,
} from './dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/user.repository';
import { UsersValidator } from './users.validator';
import { getErrorResponse } from '../../common/error';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersValidator: UsersValidator,
    private readonly usersRepository: UsersRepository,
  ) {}

  async addUser(params: CreateUserDto): Promise<ResponseWithoutData> {
    try {
      // validate create user params
      const validationResults = await this.usersValidator.validateCreateUser(
        params,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // hash password
      const hashedPassword = await bcrypt.hash(params.password, 10);

      // save user
      const user = await this.usersRepository.addUser({
        username: params.username,
        role: params.role,
        password: hashedPassword,
      });

      if (!user)
        throw new InternalServerErrorException(
          `Could not Proceed with User Registration`,
        );

      // success
      return Response.withoutData(HttpStatus.CREATED, '');
    } catch (error) {
      logger.error(`An error occurred while saving user: ${error}`);
      return getErrorResponse(error);
    }
  }

  async getAllUsers(): Promise<ResponseWithData> {
    try {
      // retrieve all users
      const users = await this.usersRepository.getAllUsers();
      return Response.withData(
        HttpStatus.OK,
        'Users retrieved successfully',
        users.map((user) => {
          return new UserEgressDto(
            user.id,
            user.username,
            user.deposits,
            user.role,
          );
        }),
      );
    } catch (error) {
      logger.error(`An error occurred while retrieving user: ${error}`);
      return getErrorResponse(error);
    }
  }

  async updateUser(
    userId: string,
    data: UpdateUserDto,
  ): Promise<ResponseWithData> {
    try {
      // validate update user
      const validationResults = await this.usersValidator.validatePatch(data);
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // hash password if payload includes password
      let hashedPassword;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      // update user
      await this.usersRepository.updateUser(userId, {
        password: hashedPassword,
        role: data.role,
      });

      // success
      return Response.withoutData(HttpStatus.OK, 'User updated successfully');
    } catch (error) {
      logger.error(`An error occurred while updating user: ${error}`);
      return getErrorResponse(error);
    }
  }

  async deleteUser(userId: string): Promise<ResponseWithData> {
    try {
      // validate delete user
      const validationResults = await this.usersValidator.validateRemoveuser(
        userId,
      );
      if (validationResults.status !== HttpStatus.OK) return validationResults;

      // delete user
      await this.usersRepository.deleteUser(userId);

      return Response.withoutData(HttpStatus.OK, 'User deleted successfully');
    } catch (error) {
      logger.error(`An error occurred while deleting user: ${error}`);
      return getErrorResponse(error);
    }
  }

  async getUser(userId: string): Promise<ResponseWithData> {
    try {
      // retrieve user
      const user = await this.usersRepository.getUserById(userId);

      if (!user) {
        return Response.withoutData(
          HttpStatus.NOT_FOUND,
          `Could not find user - ${userId}`,
        );
      }
      // success
      return Response.withData(
        HttpStatus.OK,
        'User retrieved successfully',
        new UserEgressDto(user.id, user.username, user.deposits, user.role),
      );
    } catch (error) {
      logger.error(`An error occurred while getting user: ${error}`);
      return getErrorResponse(error);
    }
  }

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
