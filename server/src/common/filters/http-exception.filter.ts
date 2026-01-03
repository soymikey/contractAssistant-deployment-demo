import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Error response structure
 */
interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
  timestamp: string;
  path: string;
}

/**
 * Prisma error interface
 */
interface PrismaError {
  code: string;
  meta?: {
    target?: string[];
  };
}

/**
 * HTTP exception response interface
 */
interface HttpExceptionResponse {
  message: string | string[];
  error?: string;
  details?: unknown;
}

/**
 * Global exception filter to handle all errors uniformly
 * Provides consistent error response format across the application
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: unknown = null;

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as HttpExceptionResponse;

        if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        } else if (Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          details = responseObj.message;
        }

        error = responseObj.error || error;

        if (responseObj.details && !details) {
          details = responseObj.details;
        }
      }
    }
    // Handle Prisma errors
    else if (this.isPrismaError(exception)) {
      const prismaError = exception;
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';

      switch (prismaError.code) {
        case 'P2002':
          message = 'Unique constraint violation. Record already exists.';
          details = prismaError.meta?.target;
          break;
        case 'P2025':
          message = 'Record not found';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2003':
          message = 'Foreign key constraint failed';
          break;
        case 'P2001':
          message = 'Record not found in the database';
          status = HttpStatus.NOT_FOUND;
          break;
        default:
          message = 'Database operation failed';
          details = prismaError.code;
      }
    }
    // Handle unknown errors
    else if (exception instanceof Error) {
      message = exception.message || 'An unexpected error occurred';
      details = process.env.NODE_ENV === 'development' ? exception.stack : null;
    }

    // Build error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Only include details if they exist and not in production
    if (details && process.env.NODE_ENV !== 'production') {
      errorResponse.details = details;
    }

    // Log the error
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }

  /**
   * Type guard to check if an error is a Prisma error
   */
  private isPrismaError(exception: unknown): exception is PrismaError {
    return (
      exception !== null &&
      typeof exception === 'object' &&
      'code' in exception &&
      typeof (exception as { code: unknown }).code === 'string'
    );
  }
}
