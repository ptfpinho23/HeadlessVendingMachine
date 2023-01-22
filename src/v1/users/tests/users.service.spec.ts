import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from '@prisma/client';
import {
  CACHE_MANAGER,
  CacheModule,
  CanActivate,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../db/prisma.service';
import { UsersValidator } from '../users.validator';
import { ResponseWithData } from '../../../common/entities/response.entity';
import { UsersRepository } from '../../repositories/user.repository';
import { UsersService } from '../users.sevice';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

describe(' User Service Integration Testing', () => {
  let service: UsersService;
  let userRepository: UsersRepository;
  let userValidator: UsersValidator;

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
      imports: [CacheModule.register()],
      providers: [
        UsersService,
        UsersValidator,
        UsersRepository,
        PrismaService,
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

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UsersRepository>(UsersRepository);
    userValidator = module.get<UsersValidator>(UsersValidator);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should check if payload is empty when saving user', async () => {
    jest
      .spyOn(userRepository, 'addUser')
      .mockImplementation(() => Promise.resolve(user_mock));

    const data: ResponseWithData = await service.addUser({
      password: '',
      role: Roles.buyer,
      username: '',
    });

    expect(data.status).toEqual(400);
  });

  it('should save user successfully', async () => {
    jest
      .spyOn(userRepository, 'addUser')
      .mockImplementation(() => Promise.resolve(user_mock));
    jest
      .spyOn(userValidator, 'validateCreateUser')
      .mockImplementation(() =>
        Promise.resolve({ status: HttpStatus.OK, message: '123' }),
      );

    const data: ResponseWithData = await service.addUser({
      password: 'testing123',
      role: Roles.buyer,
      username: 'pedro123',
    });
    expect(data.status).toEqual(201);
  });

  it('should retrieve all users', async () => {
    jest.spyOn(userRepository, 'getAllUsers').mockImplementation(() =>
      Promise.resolve([
        {
          ...user_mock,
        },
      ]),
    );
    const data = await service.getAllUsers();
    expect(data.status).toEqual(200);
  });

  it('should check if user exist when deleting user', async () => {
    //orm should throw not found exception
    jest.spyOn(userRepository, 'deleteUser').mockImplementation(() => {
      throw new NotFoundException();
    });
    jest.spyOn(userRepository, 'getUserById').mockImplementation(undefined);

    const data = await service.deleteUser('5050505');
    expect(data.status).toEqual(404);
  });

  it('should check if user exist when updating user', async () => {
    jest
      .spyOn(userValidator, 'validatePatch')
      .mockImplementation(() =>
        Promise.resolve({ status: HttpStatus.OK, message: '123' }),
      );
    jest.spyOn(userRepository, 'updateUser').mockImplementation(undefined);

    const data = await service.updateUser('5050506', {
      password: 'testing123',
      role: Roles.buyer,
    });
    expect(data.status).toEqual(200);
  });
});
