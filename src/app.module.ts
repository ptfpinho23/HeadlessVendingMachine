import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './v1/auth/auth.module';
import { UsersModule } from './v1/users/users.module';
import { ProductsModule } from './v1/products/products.module';
import { PurchaseModule } from './v1/purchase/purchase.module';
import * as redisStore from 'cache-manager-redis-store';
import { SESSION_TTL } from './common/constants';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    PurchaseModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env,
      ttl: SESSION_TTL,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
