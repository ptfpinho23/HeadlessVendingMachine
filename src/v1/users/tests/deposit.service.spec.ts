import { Test, TestingModule } from '@nestjs/testing';
import {
  CACHE_MANAGER,
  CacheModule,
  CanActivate,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../../db/prisma.service';
import { UsersValidator } from '../users.validator';
import { UsersRepository } from '../../repositories/user.repository';
import { UsersService } from '../users.sevice';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { DepositService } from '../deposit.service';

describe('Deposit Service Integration Testing', () => {
  let service: DepositService;
  let userRepository: UsersRepository;
  let userValidator: UsersValidator;

  beforeEach(async () => {
    const mock_guard: CanActivate = { canActivate: jest.fn(() => true) };
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        UsersService,
        UsersValidator,
        UsersRepository,
        PrismaService,
        DepositService,
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

    service = module.get<DepositService>(DepositService);
    userRepository = module.get<UsersRepository>(UsersRepository);
    userValidator = module.get<UsersValidator>(UsersValidator);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('If a deposit increment request is made ', () => {
    const mockDto = {
      amount: 1234,
    };

    it('Should validate payload ', async () => {
      jest
        .spyOn(userValidator, 'validateDeposit')
        .mockImplementation(() => Promise.resolve(''));
      await service.deposit('123', mockDto);

      expect(userValidator.validateDeposit).toBeCalledWith(mockDto, '123');
      expect(userValidator.validateDeposit).toHaveBeenCalledTimes(1);
    });

    it('should call entity repository with the correct payload', async () => {
      jest
        .spyOn(userValidator, 'validateDeposit')
        .mockImplementation(() => Promise.resolve({ status: HttpStatus.OK }));
      jest
        .spyOn(userRepository, 'incrementDeposit')
        .mockImplementation(() => Promise.resolve(''));

      await service.deposit('123', mockDto);

      expect(userRepository.incrementDeposit).toBeCalledWith(
        '123',
        mockDto.amount,
      );
      expect(userRepository.incrementDeposit).toHaveBeenCalledTimes(1);
    });
  });
});
