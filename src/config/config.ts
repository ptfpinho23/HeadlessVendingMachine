export const config = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  joiOptions: {
    errors: {
      wrap: { label: '' },
    },
    abortEarly: true,
  },
};
