import { User } from '@prisma/client';

export class AuthResponse {
  token: string;
  user: User;
}

export class LoginDto {
  username: string;
  password: string;
}
