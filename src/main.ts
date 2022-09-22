import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { migration } from './database/migration';

async function bootstrap() {
  const Port = 3000;
  await migration();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Аренда автомобилей')
    .setDescription('Расчет стоимости аренды автомобилей')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(Port, () => Logger.log(`Server started on port = ${Port}`));
}
bootstrap();
