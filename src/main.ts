import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('headless Vending Machine API')
    .setDescription('A Simple headless Vending Machine API Implementation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);

  await app.listen((process.env.SERVER_PORT as string) ?? 8000);
}
bootstrap();
