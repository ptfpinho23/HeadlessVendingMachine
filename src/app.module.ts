import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [CacheModule.register({
    store: redisStore,
    host: process.env.HOST ?? 'localhost',
    port: process.env.PORT ?? 6379
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
