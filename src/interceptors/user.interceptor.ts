import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T | null;
  errorCode?: number;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly successMessage: string) {}

  intercept(
    _: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        message: this.successMessage,
        success: true,
        data,
      })),
      catchError((error) => {
        const message = error?.response || 'Internal Server Error';
        const statusCode = error?.status || 500;

        return throwError(() => ({
          message,
          success: false,
          statusCode,
        }));
      }),
    );
  }
}
