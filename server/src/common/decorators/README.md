# Custom Decorators

## @CurrentUser Decorator

A type-safe decorator for extracting authenticated user information from JWT-protected endpoints.

### Why Use @CurrentUser Instead of @Request()?

**Before (using `any` type):**
```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req: any) {
  const userId: string = req.user.userId as string; // Type casting required, no IDE support
  const email: string = req.user.email as string;
  // ...
}
```

**Problems:**
- ❌ No type safety (`any` type)
- ❌ No IDE autocomplete
- ❌ Manual type casting required
- ❌ Prone to typos (e.g., `req.user.userID` won't be caught)
- ❌ Verbose code

**After (using `@CurrentUser`):**
```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@CurrentUser() user: RequestUser) {
  // user.userId and user.email are fully typed
  // Full IDE autocomplete support
}
```

**Benefits:**
- ✅ Full type safety
- ✅ IDE autocomplete
- ✅ No type casting needed
- ✅ Compile-time error checking
- ✅ Cleaner, more readable code

### Usage Examples

#### 1. Extract the entire user object

```typescript
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';

@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@CurrentUser() user: RequestUser) {
  console.log(user.userId);  // Type: string
  console.log(user.email);   // Type: string
  return user;
}
```

#### 2. Extract only the userId (most common)

```typescript
@Get('contracts')
@UseGuards(JwtAuthGuard)
async getUserContracts(@CurrentUser('userId') userId: string) {
  return this.contractService.findByUserId(userId);
}
```

#### 3. Extract only the email

```typescript
@Post('send-notification')
@UseGuards(JwtAuthGuard)
async sendNotification(
  @Body() dto: NotificationDto,
  @CurrentUser('email') email: string,
) {
  return this.notificationService.send(email, dto);
}
```

#### 4. Multiple parameters

```typescript
@Put(':id')
@UseGuards(JwtAuthGuard)
async updateContract(
  @Param('id') contractId: string,
  @Body() updateDto: UpdateContractDto,
  @CurrentUser('userId') userId: string,
) {
  return this.contractService.update(contractId, updateDto, userId);
}
```

### Type Definitions

```typescript
export interface RequestUser {
  userId: string;  // User's UUID from JWT payload
  email: string;   // User's email from JWT payload
}
```

This interface matches the data returned by `JwtStrategy.validate()` in the auth module.

### When to Use

- ✅ Use `@CurrentUser()` for all JWT-protected endpoints
- ✅ Use `@CurrentUser('userId')` when you only need the user ID
- ✅ Use `@CurrentUser('email')` when you only need the email
- ❌ Don't use `@Request() req: any` anymore

### Related Files

- **Decorator**: `src/common/decorators/current-user.decorator.ts`
- **Type Definition**: `src/common/types/authenticated-request.interface.ts`
- **JWT Strategy**: `src/auth/strategies/jwt.strategy.ts` (defines the user object shape)

### Migration Guide

If you have existing code using `@Request() req: any`, migrate it like this:

**Old Code:**
```typescript
@Get('something')
@UseGuards(JwtAuthGuard)
async doSomething(@Request() req: any) {
  const userId: string = req.user.userId as string;
  return this.service.method(userId);
}
```

**New Code:**
```typescript
@Get('something')
@UseGuards(JwtAuthGuard)
async doSomething(@CurrentUser('userId') userId: string) {
  return this.service.method(userId);
}
```

### Testing

When writing unit tests, you can mock the `RequestUser`:

```typescript
const mockUser: RequestUser = {
  userId: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
};

// In your test
it('should return user profile', async () => {
  const result = await controller.getProfile(mockUser);
  expect(result.userId).toBe(mockUser.userId);
});
```
