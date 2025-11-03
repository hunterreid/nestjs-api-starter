import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig, LoggingConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const loggingConfig = configService.get<LoggingConfig>('logging');

  const logger = new Logger('Bootstrap');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('NestJS API Starter')
    .setDescription(
      'A stateful NestJS server application with Swagger UI and Redis support. ' +
      'This API provides a complete CRUD example with Items resource, ' +
      'featuring UUID-based IDs, timestamps, and Redis persistence with atomic operations.',
    )
    .setVersion('1.0')
    .addTag('items', 'CRUD operations for Items resource')
    .addTag('debug', 'Debug and profiling endpoints (development only)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'NestJS API Starter - Swagger UI',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = appConfig.port;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger UI available at: http://localhost:${port}/swagger`);
  logger.log(`🔧 Environment: ${appConfig.environment}`);
  logger.log(`📊 Log Level: ${loggingConfig.level}`);

  if (appConfig.environment === 'development') {
    logger.log(`🐛 Debug endpoints available at: http://localhost:${port}/debug/pprof`);
  }
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
