import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Increase payload size limit for base64 images (50MB)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Security: Enable helmet with appropriate configuration
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Enable CORS for React Native client
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Set global prefix (api/v1)
  app.setGlobalPrefix('api/v1');

  // Enable validation pipes with transformation and whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );

  // Apply global exception filter for unified error handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Apply global response transformer for consistent API responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API Documentation Configuration
  const config = new DocumentBuilder()
    .setTitle('Contract Assistant API')
    .setDescription(
      'RESTful API for Contract Assistant - AI-powered contract analysis platform',
    )
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Contracts', 'Contract management endpoints')
    .addTag('Analysis', 'AI-powered contract analysis endpoints')
    .addTag('Upload', 'File upload endpoints')
    .addTag('Favorites', 'User favorites management')
    .addTag('Health', 'Application health check endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name will be used in @ApiBearerAuth() decorator
    )
    .addServer('http://localhost:3000/api/v1', 'Local Development')
    .addServer('https://api.contractassistant.com/api/v1', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'Contract Assistant API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  logger.log(
    `📚 API Documentation available at: http://localhost:${port}/api-docs`,
  );
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

void bootstrap();
