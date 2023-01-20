import 'dotenv/config';

export const config = {
  databaseUrl: process.env.DATABASE_UR!,
  jwtSecret: process.env.JWT_SECRET!,
  joiOptions: {
    errors: {
      wrap: { label: '' },
    },
    abortEarly: true,
  },
};
