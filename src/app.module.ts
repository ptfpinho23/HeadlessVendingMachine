import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [CacheModule.register({
    host: process.env.HOST ?? 'localhost',
    port: process.env.PORT ?? 6379,
    isGlobal: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
