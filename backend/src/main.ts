import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for webhook signature verification
  });

  app.useLogger(app.get(Logger));

  // Correlate requests with a stable request id
  app.use((req, res, next) => {
    const rid =
      (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
    (req as any).requestId = rid;
    res.setHeader('x-request-id', rid);
    next();
  });

  // Security headers (XSS, clickjacking, MIME sniffing protection)
  app.use(helmet());

  // CORS lockdown
  app.enableCors({
    origin: [
      'https://vivahverse.com',
      'https://admin.vivahverse.com',
      'http://localhost:3000',
      'http://localhost:3001', // Next.js dev
      'http://localhost:5173', // Vite dev
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true,
      transform: true, // auto-transform types
    }),
  );

  // Structured request logging
  app.useGlobalInterceptors(new LoggingInterceptor());
  // Global exception filter (hides internal errors)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API documentation (disable in production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Vivah Verse API')
      .setDescription('Wedding marketplace backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Serve invoice PDFs statically
  app.use('/invoices', express.static(join(process.cwd(), 'invoices')));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}
void bootstrap();
