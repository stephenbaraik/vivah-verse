import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import * as Sentry from '@sentry/node';

const sentryEnabled = Boolean(process.env.SENTRY_DSN);

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse;
    } else {
      // Log internal errors but don't expose them
      this.logger.error('Unhandled exception', exception);
    }

    if (sentryEnabled && status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      Sentry.captureException(exception, {
        tags: { scope: 'http-exception', status: String(status) },
        extra: {
          path: request?.url,
          method: request?.method,
          userAgent: request?.headers?.['user-agent'],
        },
      });
    }

    // Never expose stack traces or internal details in production
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    } else {
      response.status(status).json({
        statusCode: status,
        ...(typeof message === 'object' ? message : { message }),
        timestamp: new Date().toISOString(),
      });
    }
  }
}
