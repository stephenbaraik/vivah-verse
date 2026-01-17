import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const method = request?.method;
    const path = request?.originalUrl ?? request?.url;
    const userId = request?.user?.id;
    const requestId = request?.requestId;
    const userAgent = request?.headers?.['user-agent'];

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - now;
        const statusCode = response?.statusCode;

        // Emit a structured log line (plain console keeps zero deps)
        console.log(
          JSON.stringify({
            level: 'info',
            event: 'http_request',
            method,
            path,
            statusCode,
            durationMs,
            requestId,
            userId,
            userAgent,
          }),
        );
      }),
    );
  }
}
