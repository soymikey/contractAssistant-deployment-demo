import { Request } from 'express';
import { RequestUser } from '../decorators/current-user.decorator';

/**
 * Extended Express Request with authenticated user
 * This type is used when you need to access req.user in controllers
 */
export interface AuthenticatedRequest extends Request {
  user: RequestUser;
}
