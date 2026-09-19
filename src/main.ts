import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Delete, Get, Patch, Post, Put, ValidationPipe, VersioningType } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder().
    setTitle('E-Commerce API').
    setDescription('NestJs Api Documentation').
    setVersion('1.0').addBearerAuth(
      {
        type:'http',
        scheme:'bearer',
        bearerFormat:'JWT'
      },
      'access-token',
    ).build();

  const document = SwaggerModule.createDocument(app,swaggerConfig);

  SwaggerModule.setup('api',app,document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    // new TransformInterceptor()
  )

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI
  });

  app.enableCors();

  // Restict for frontend
  // app.enableCors({
  //   origin:'http://localhost:5173',
  //   methods: 'Get,Put,Patch,Post,Delete',
  //   credentials: true
  // })

}
bootstrap();