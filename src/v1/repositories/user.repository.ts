import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../db/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../users/dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  addUser(params: CreateUserDto): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.create({
          data: {
            password: params.password,
            role: params.role,
            username: params.username,
          },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserByUsername(username: string): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.findUnique({
          where: {
            username,
          },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserById(userId: string): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
        });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAllUsers(): Promise<User[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.prismaService.user.findMany({});

        resolve(users);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateUser(userId: string, params: UpdateUserDto): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
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

  deleteUser(userId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.delete({
          where: {
            id: userId,
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  incrementDeposit(userId: string, amount: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            deposits: {
              increment: amount,
            },
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  decreaseDeposit(userId: string, amount: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            deposits: { decrement: amount },
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  updateDeposit(userId: string, deposit: number) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            deposits: deposit,
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }

  resetDeposit(userId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.prismaService.user.update({
          where: {
            id: userId,
          },
          data: {
            deposits: 0,
          },
        });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });
  }
}
