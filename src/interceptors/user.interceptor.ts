import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
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
        console.log(error);
        const message = error?.response?.message || 'Internal Server Error';
        const statusCode = error?.status || 500;

        if (statusCode === 404)
          throw new NotFoundException({ message, success: false });

        throw new BadRequestException({ message, success: false });
      }),
    );
  }
}
