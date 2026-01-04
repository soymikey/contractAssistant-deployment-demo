import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * User data extracted from JWT token
 */
export interface RequestUser {
  userId: string;
  email: string;
}

/**
 * Custom decorator to extract the current authenticated user from the request
 *
 * Usage:
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: RequestUser) {
 *   return { userId: user.userId, email: user.email };
 * }
 *
 * Or extract just the userId:
 * @Get('contracts')
 * @UseGuards(JwtAuthGuard)
 * getContracts(@CurrentUser('userId') userId: string) {
 *   return this.service.getUserContracts(userId);
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as RequestUser;

    // If a specific field is requested, return only that field
    return data ? user?.[data] : user;
  },
);
