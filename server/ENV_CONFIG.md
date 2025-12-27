# Environment Configuration Guide

## Overview

This project uses multiple environment files for different deployment scenarios. The NestJS ConfigModule automatically loads the appropriate configuration based on the `NODE_ENV` variable.

## Environment Files

### 📁 `.env` (Git Ignored)
- **Purpose**: Development environment
- **Usage**: Local development
- **Status**: Must be created from `.env.example`
- **Git**: ❌ Not committed (in .gitignore)

### 📁 `.env.example` (Git Tracked)
- **Purpose**: Template file with all configuration options
- **Usage**: Copy this to create your `.env` file
- **Status**: ✅ Committed to repository as reference
- **Git**: ✅ Tracked

### 📁 `.env.production` (Git Ignored)
- **Purpose**: Production environment configuration
- **Usage**: Production deployments
- **Status**: Created but needs real values
- **Git**: ❌ Not committed (in .gitignore)
- **Important**: Update all placeholder values before deploying

### 📁 `.env.test` (Git Ignored)
- **Purpose**: Test environment configuration
- **Usage**: Running automated tests
- **Status**: Created with test-specific settings
- **Git**: ❌ Not committed (in .gitignore)

## Setup Instructions

### First-Time Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Update the configuration** in `.env` with your local values:
   ```bash
   # Example:
   DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/contract_assistant"
   JWT_SECRET="your-development-secret"
   GEMINI_API_KEY="your-api-key"
   ```

### Running in Different Environments

#### Development (default)
```bash
npm run start:dev
# or
pnpm start:dev
```
Loads: `.env.development` (if exists) → `.env`

#### Production
```bash
NODE_ENV=production npm run start:prod
# or
NODE_ENV=production pnpm start:prod
```
Loads: `.env.production` → `.env`

#### Test
```bash
NODE_ENV=test npm run test
# or
NODE_ENV=test pnpm test
```
Loads: `.env.test` → `.env`

## Configuration Validation

The application validates all environment variables on startup using Joi schema. See `src/config/validation.schema.ts` for details.

### Required Variables

The following variables are **required** and the application will fail to start without them:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation

### Optional Variables

All other variables have sensible defaults and are optional.

## Using Configuration in Code

### Basic Usage

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  getConfig() {
    // Get with default value
    const port = this.configService.get<number>('PORT', 3000);
    
    // Get required value (throws if not found)
    const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    
    // Check environment
    const isProd = this.configService.get('NODE_ENV') === 'production';
  }
}
```

See `src/config/config.example.ts` for more examples.

## Security Best Practices

### ⚠️ DO NOT:
- ❌ Commit `.env`, `.env.production`, or `.env.test` files
- ❌ Share API keys or secrets in code or documentation
- ❌ Use development secrets in production
- ❌ Store passwords in plain text

### ✅ DO:
- ✅ Use strong, randomly generated secrets in production
- ✅ Rotate secrets regularly
- ✅ Use environment-specific configurations
- ✅ Keep `.env.example` updated with new variables
- ✅ Use secret management services in production (AWS Secrets Manager, etc.)

## Configuration Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | string | development | Environment: development, production, test |
| `PORT` | number | 3000 | Server port |
| `DATABASE_URL` | string | **required** | PostgreSQL connection string |
| `JWT_SECRET` | string | **required** | JWT secret key |
| `ALLOWED_ORIGINS` | string | localhost:3000 | CORS allowed origins (comma-separated) |
| `AI_SERVICE` | string | gemini | AI provider: openai, anthropic, gemini |
| `LOG_LEVEL` | string | info | Log level: error, warn, info, debug |

For complete list, see `.env.example`.

## Troubleshooting

### Application won't start
- Check that `.env` file exists
- Verify all required variables are set
- Check validation errors in console output

### Configuration not loading
- Verify `NODE_ENV` is set correctly
- Check file naming (`.env.production`, not `.env.prod`)
- Ensure no syntax errors in .env file

### Changes not taking effect
- Restart the application (ConfigModule caches values)
- Check if you're editing the correct .env file for your environment

## Production Deployment

Before deploying to production:

1. ✅ Copy `.env.example` to `.env.production`
2. ✅ Update all placeholder values with real credentials
3. ✅ Generate strong secrets: `openssl rand -base64 32`
4. ✅ Use S3 for file storage (set `STORAGE_TYPE=s3`)
5. ✅ Enable monitoring (set `SENTRY_DSN`)
6. ✅ Set appropriate `LOG_LEVEL` (warn or error)
7. ✅ Configure production database and Redis
8. ✅ Set restrictive CORS origins
9. ✅ Test configuration in staging environment first

## Additional Resources

- [NestJS Configuration Documentation](https://docs.nestjs.com/techniques/configuration)
- [Joi Validation](https://joi.dev/api/)
- [The Twelve-Factor App: Config](https://12factor.net/config)
