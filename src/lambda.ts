import { configure as serverlessExpress } from '@vendia/serverless-express';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    nestApp.enableCors({
      origin: [process.env.URL_CORS],
      methods: ['GET', 'POST'],
      credentials: true,
    });
    nestApp.setGlobalPrefix('api');

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    const options = new DocumentBuilder()
      .setTitle(process.env.APP_NAME)
      .setDescription(process.env.APP_DESCRIPTION)
      .setVersion(process.env.APP_VERSION)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(nestApp, options);

    SwaggerModule.setup('api-doc', nestApp, document);
    await nestApp.init();
    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }
  return cachedServer(event, context);
};
