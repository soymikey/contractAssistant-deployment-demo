# Contract Assistant - Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A powerful RESTful API backend for the Contract Assistant application, built with NestJS, PostgreSQL, and Redis.

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation:

- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **API Base URL**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

The Swagger documentation provides:
- Complete API endpoint reference
- Request/response schemas
- Try-it-out functionality
- Authentication examples
- Model definitions

## Description

Enterprise-grade backend API for contract analysis and management, featuring:
- 🔐 JWT authentication and authorization
- 📄 AI-powered contract analysis (Gemini/OpenAI/Claude)
- 📁 File upload and storage management
- 🔍 OCR text extraction
- 📊 Contract risk assessment
- ⚡ Redis-based job queues for async processing
- 💾 PostgreSQL database with Prisma ORM
- 🏥 Health check endpoints
- 📖 Auto-generated Swagger API documentation

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher
- **PostgreSQL**: 14.x or higher
- **Redis**: 7.x or higher

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with database and Redis credentials
# Edit .env and set:
# - DATABASE_URL
# - REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
# - JWT_SECRET
# - AI service API keys (GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY)

# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# (Optional) Seed the database
pnpm prisma db seed
```

## 🛠️ Development

### Run the application

```bash
# Development mode with hot reload
pnpm start:dev

# Production mode
pnpm start:prod

# Debug mode
pnpm start:debug
```

### Build the application

```bash
# Build for production
pnpm build

# The compiled output will be in the dist/ directory
```

### Database Management

```bash
# Create a new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Open Prisma Studio (Database GUI)
pnpm prisma studio

# Reset database (⚠️ WARNING: Deletes all data)
pnpm prisma migrate reset

# Check database connection
bash scripts/check-env.sh
```

### Backup & Restore

```bash
# Backup database
bash scripts/backup-db.sh

# Restore database
bash scripts/restore-db.sh backup_file.sql
```

## 🧪 Testing

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run a specific test file
pnpm test -- user.service.spec.ts

# Run e2e tests
pnpm test:e2e

# Generate test coverage report
pnpm test:cov

# The coverage report will be in coverage/ directory
```

## 📦 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── ai-analysis/           # AI contract analysis module
│   ├── auth/                  # Authentication module (TODO)
│   ├── common/                # Shared utilities
│   │   ├── constants/         # Constants (error codes, messages)
│   │   ├── filters/           # Exception filters
│   │   └── interceptors/      # Response interceptors
│   ├── config/                # Configuration files
│   ├── contract/              # Contract management module (TODO)
│   ├── health/                # Health check endpoints
│   ├── prisma/                # Prisma service
│   ├── queues/                # Bull queue management
│   │   ├── processors/        # Queue job processors
│   │   ├── queue-names.const.ts
│   │   ├── queues.service.ts
│   │   └── README.md          # Queue documentation
│   ├── user/                  # User management module (TODO)
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # Root controller
│   ├── app.service.ts         # Root service
│   └── main.ts                # Application entry point
├── test/                      # E2E tests
├── scripts/                   # Utility scripts
│   ├── backup-db.sh          # Database backup
│   ├── restore-db.sh         # Database restore
│   └── check-env.sh          # Environment check
├── .env                       # Environment variables (git-ignored)
├── .env.example              # Environment template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/contract_assistant

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# AI Services (configure at least one)
AI_SERVICE=gemini
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-claude-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
```

### Configuration Files

- `src/config/validation.schema.ts` - Environment variable validation schema
- `prisma/schema.prisma` - Database models and relations
- `nest-cli.json` - NestJS CLI configuration
- `tsconfig.json` - TypeScript configuration

## 🏥 Health Checks

The application provides health check endpoints for monitoring:

- **GET /api/v1/health** - Comprehensive health check (database, memory, disk)
- **GET /api/v1/health/live** - Liveness probe (for Kubernetes)
- **GET /api/v1/health/ready** - Readiness probe (for Kubernetes)

Example response:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "storage": { "status": "up" }
  }
}
```

## ⚡ Queue System

The application uses Bull (Redis-based queues) for async job processing:

- **analysis-queue** - AI contract analysis jobs
- **upload-queue** - File upload processing
- **ocr-queue** - OCR text extraction
- **notification-queue** - Email/push notifications

See [src/queues/README.md](src/queues/README.md) for detailed queue documentation.

## 🔐 Authentication & Authorization

Authentication system using JWT + Passport.js (Coming in Week 2-3):
- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Password reset functionality

## 🐛 Troubleshooting

### Redis Connection Issues

If you encounter `NOAUTH Authentication required` error:
1. Check Redis password in `.env` file
2. See [REDIS_CONNECTION_TROUBLESHOOTING.md](../REDIS_CONNECTION_TROUBLESHOOTING.md) for detailed solutions

### Database Connection Issues

```bash
# Test database connection
pnpm prisma db pull

# View connection errors
pnpm start:dev
```

### Port Already in Use

```bash
# Windows: Find process using port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F

# Linux/Mac: Find and kill process
lsof -ti:3000 | xargs kill -9
```

## 📖 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start in production mode |
| `pnpm start:dev` | Start in development mode with hot reload |
| `pnpm start:debug` | Start in debug mode |
| `pnpm build` | Build for production |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cov` | Generate coverage report |
| `pnpm test:e2e` | Run e2e tests |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm prisma generate` | Generate Prisma Client |
| `pnpm prisma migrate dev` | Run migrations in dev |
| `pnpm prisma studio` | Open Prisma Studio |

## 🚢 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t contract-assistant-api .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure strong `JWT_SECRET`
- [ ] Set up production database
- [ ] Configure Redis with password
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS allowed origins
- [ ] Set up monitoring (Sentry)
- [ ] Configure automated backups
- [ ] Set up logging aggregation
- [ ] Review security headers (helmet)
- [ ] Enable rate limiting

For detailed deployment guide, see [NestJS Deployment Documentation](https://docs.nestjs.com/deployment).

## 🏗️ Architecture

### Tech Stack

- **Framework**: NestJS 10+
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5+
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5+
- **Cache/Queue**: Redis 7+ / Bull 4+
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI (@nestjs/swagger)
- **Testing**: Jest + Supertest

### Design Patterns

- **Module Pattern**: Feature-based module organization
- **Dependency Injection**: NestJS IoC container
- **Repository Pattern**: Prisma ORM abstraction
- **Queue Pattern**: Bull for async job processing
- **Interceptor Pattern**: Request/response transformation
- **Guard Pattern**: Route protection and authorization

## 📊 Current Development Status

### ✅ Completed (Week 1-2)
- [x] Project initialization and setup
- [x] NestJS application configuration
- [x] Database setup (Prisma + PostgreSQL)
- [x] Redis and Bull queue system
- [x] Health check endpoints
- [x] Swagger API documentation
- [x] Global error handling
- [x] Request/response interceptors
- [x] Environment configuration
- [x] AI Analysis module (basic)

### 🚧 In Progress
- [ ] Authentication module (Week 2-3)
- [ ] User management
- [ ] Contract management
- [ ] File upload module

### 📅 Upcoming
- [ ] OCR integration (Week 3-4)
- [ ] Advanced AI analysis (Week 4-5)
- [ ] Favorites & preferences (Week 5-6)
- [ ] Email notifications (Week 6)
- [ ] Report export (Week 6)
- [ ] Security hardening (Week 7)
- [ ] Performance optimization (Week 7)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow NestJS best practices
- Use TypeScript strict mode
- Write unit tests for services
- Write e2e tests for controllers
- Document API endpoints with Swagger decorators
- Run `pnpm lint` and `pnpm format` before committing

## 📚 Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bull Documentation](https://github.com/OptimalBits/bull)
- [Project Backend Plan](../be.md)
- [Queue System Guide](src/queues/README.md)
- [Redis Troubleshooting](../REDIS_CONNECTION_TROUBLESHOOTING.md)

### Related Projects
- [Client (React Native)](../client) - Mobile application
- [Official Website](../official-website) - Landing page

## 📝 License

This project is part of the Contract Assistant application.

## 👥 Team

For questions and support:
- Check project documentation
- Review troubleshooting guides
- Open an issue on GitHub

---

Built with ❤️ using [NestJS](https://nestjs.com)
