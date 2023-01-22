import {
  CacheModule,
  CanActivate,
  HttpStatus,
  NotFoundException,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from '../purchase.service';
import { AuthModule } from '../../auth/auth.module';
import { ProductsModule } from '../../products/products.module';
import { UsersModule } from '../../users/users.module';
import { PurchaseModule } from '../purchase.module';
import { PurchaseValidator } from '../purchase.validator';
import { UsersRepository } from '../../repositories/user.repository';
import { PrismaService } from '../../../db/prisma.service';
import { ResponseWithData } from '../../../common/entities/response.entity';
import { ProductsRepository } from '../../repositories/product.repository';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '@prisma/client';

describe('Purchase Service Testing', () => {
  let service: PurchaseService;
  let productRepository: ProductsRepository;
  let userRepository: UsersRepository;
  let purchaseValidator: PurchaseValidator;

  const product_mock = {
    id: '123',
    amountAvailable: 5,
    cost: 5,
    productName: 'Hyper Protein bar',
    sellerId: '53',
    dateCreated: new Date(),
    dateUpdated: new Date(),
  };
  const user_mock = {
    id: '123',
    username: '123',
    role: Roles.buyer,
    password: '123',
    deposits: 200,
    dateCreated: new Date(),
    dateUpdated: new Date(),
  };
  beforeEach(async () => {
    const mock_guard: CanActivate = { canActivate: jest.fn(() => true) };
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ProductsModule,
        UsersModule,
        PurchaseModule,
        CacheModule.register(),
      ],
      providers: [
        PurchaseService,
        PurchaseValidator,
        UsersRepository,
        PrismaService,
        ProductsRepository,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mock_guard)
      .overrideGuard(RolesGuard)
      .useValue(mock_guard)
      .compile();

    service = module.get<PurchaseService>(PurchaseService);
    productRepository = module.get<ProductsRepository>(ProductsRepository);
    purchaseValidator = module.get<PurchaseValidator>(PurchaseValidator);
    userRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should check if payload is empty when buying product', async () => {
    const data: ResponseWithData = await service.buyProduct(
      {
        amountOfProduct: 1,
        productId: '',
      },
      '567',
    );

    expect(data.status).toEqual(400);
  });

  describe('Service call is made for a purchase of a product', () => {
    beforeEach(() => {
      jest
        .spyOn(productRepository, 'getProductById')
        .mockImplementation(() => Promise.resolve(product_mock));
      const user_mock_2 = { ...user_mock };
      user_mock_2.deposits = 2;
      jest
        .spyOn(userRepository, 'getUserById')
        .mockImplementation(() => Promise.resolve(user_mock_2));
    });

    it('should check if product exist', async () => {
      jest.spyOn(productRepository, 'getProductById').mockImplementation(() => {
        throw new NotFoundException();
      });
      const data: ResponseWithData = await service.buyProduct(
        {
          amountOfProduct: 1,
          productId: 'ggggg',
        },
        '56656',
      );
      expect(data.status).toEqual(404);
    });

    it('Should validate available product amounts on purchase', async () => {
      jest
        .spyOn(purchaseValidator, 'validateBuyProduct')
        .mockImplementation(() =>
          Promise.resolve({ status: HttpStatus.OK, message: '123' }),
        );
      const data: ResponseWithData = await service.buyProduct(
        {
          amountOfProduct: product_mock.amountAvailable + 5,
          productId: product_mock.id,
        },
        '56656',
      );
      expect(data.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should validate total user deposit before issuing a purchase', async () => {
      jest
        .spyOn(purchaseValidator, 'validateBuyProduct')
        .mockImplementation(() =>
          Promise.resolve({ status: HttpStatus.OK, message: '123' }),
        );
      const data: ResponseWithData = await service.buyProduct(
        {
          amountOfProduct: 1,
          productId: product_mock.id,
        },
        '123',
      );

      expect(data.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return the expected change value & array', async () => {
      jest
        .spyOn(userRepository, 'getUserById')
        .mockImplementation(() => Promise.resolve(user_mock));
      jest
        .spyOn(productRepository, 'decreaseProductStock')
        .mockImplementation(undefined);
      jest.spyOn(userRepository, 'resetDeposit').mockImplementation(undefined);
      jest
        .spyOn(purchaseValidator, 'validateBuyProduct')
        .mockImplementation(() =>
          Promise.resolve({ status: HttpStatus.OK, message: '123' }),
        );
      const data: ResponseWithData = await service.buyProduct(
        {
          amountOfProduct: 5,
          productId: product_mock.id,
        },
        '123',
      );
      const expectedCoinChange = [100, 50, 20, 5];

      expect(data.status).toBe(HttpStatus.CREATED);
      expect(data.data.Change).toStrictEqual(expectedCoinChange);
    });
  });
});
