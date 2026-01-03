import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Transform interceptor to standardize all API responses
 * Wraps the response data in a consistent format
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data: T | ApiResponse<T>): ApiResponse<T> => {
        // If data is already in the standard format, return as is
        if (
          data &&
          typeof data === 'object' &&
          'statusCode' in data &&
          'message' in data &&
          'timestamp' in data
        ) {
          return data as ApiResponse<T>;
        }

        // Handle objects with data and message properties
        const hasDataProperty =
          data &&
          typeof data === 'object' &&
          'data' in data &&
          data.data !== undefined;
        const hasMessageProperty =
          data && typeof data === 'object' && 'message' in data;

        // Otherwise, wrap it in standard format
        return {
          statusCode: response.statusCode as number,
          message: hasMessageProperty
            ? String((data as { message: unknown }).message)
            : 'Success',
          data: hasDataProperty
            ? ((data as { data: T }).data as T)
            : (data as T),
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
