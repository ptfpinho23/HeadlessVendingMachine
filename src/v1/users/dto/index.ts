import { Roles } from '@prisma/client';

// ingress dtos
export class CreateUserDto {
  username: string;
  password: string;
  role: Roles;
}

export class UpdateUserDto {
  password?: string;
  role?: Roles;
}

export class CreateDepositPreviewDto {
  amount: number;
}

export class CreateDepositDto {
  amount: number;
}

// egress dtos

export class UserEgressDto {
  constructor(
    public id: string,
    public username: string,
    public deposits: number,
    public role: Roles,
  ) {}
}
