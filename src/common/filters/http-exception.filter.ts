import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

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
