# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Contract Assistant is an AI-powered contract analysis platform with a monorepo architecture using pnpm workspaces. The system consists of:

- **Client**: React Native/Expo mobile application (iOS, Android, Web)
- **Server**: NestJS backend API with PostgreSQL and Redis
- **Official Website**: Next.js marketing site (in `/official-website/`)

The app uses multimodal AI (Google Generative AI/Gemini) to analyze contracts from photos, PDFs, and documents, identifying risks and providing recommendations.

## Development Commands

### Package Manager
This project uses **pnpm** exclusively (not npm/yarn). All commands should use `pnpm`.

### Root Workspace Commands
```bash
# Install all workspace dependencies
pnpm install

# Start both client and server in development mode
pnpm dev:client    # Starts Expo dev server
pnpm dev:server    # Starts NestJS with hot reload
```

### Client (React Native/Expo) - `/client`
```bash
# Development
pnpm start          # Expo dev server
pnpm android        # Android emulator
pnpm ios            # iOS simulator
pnpm web            # Web browser

# Code Quality
pnpm lint           # ESLint with Expo config
pnpm format         # Prettier formatting
pnpm format:check   # Check formatting

# Project Management
pnpm reset-project  # Move starter code to app-example/
```

### Server (NestJS) - `/server`
```bash
# Development
pnpm start:dev      # Watch mode with hot reload
pnpm start:debug    # Debug mode
pnpm start:prod     # Production build

# Build & Quality
pnpm build          # Compile TypeScript
pnpm lint           # ESLint with auto-fix
pnpm format         # Prettier formatting

# Testing
pnpm test           # Run all unit tests
pnpm test:watch     # Watch mode
pnpm test:cov       # With coverage report
pnpm test:e2e       # End-to-end tests
pnpm test -- path/to/test.spec.ts  # Run specific test

# Database Operations
pnpm db:migrate:dev # Create/apply migrations
pnpm db:migrate     # Deploy migrations
pnpm db:seed        # Seed database
pnpm db:reset       # Reset database
pnpm db:studio      # Prisma Studio UI
pnpm db:generate    # Generate Prisma client
```

## Architecture Overview

### Monorepo Structure
```
ContractAssistant/
├── client/         # React Native/Expo app
│   ├── app/        # Expo Router file-based routing
│   ├── components/ # Reusable UI components
│   ├── services/   # API service layer (Axios)
│   ├── stores/     # Zustand state management
│   ├── hooks/      # Custom React hooks
│   └── types/      # TypeScript definitions
├── server/         # NestJS backend
│   ├── src/
│   │   ├── ai-analysis/    # AI contract analysis
│   │   ├── auth/           # JWT authentication
│   │   ├── contract/       # Contract management
│   │   ├── document/       # Document processing
│   │   ├── upload/         # File upload handling
│   │   ├── ocr/            # Text extraction
│   │   ├── queues/         # Redis Bull job queues
│   │   └── prisma/         # Database ORM
│   └── uploads/    # File storage
└── official-website/ # Next.js marketing site
```

### Key Architectural Patterns

**Backend (NestJS):**
- Modular architecture with feature-based modules
- Repository pattern with Prisma ORM
- Service layer for business logic
- Redis Bull queues for async AI processing
- JWT authentication with Passport.js
- Global exception filters and validation pipes
- Swagger/OpenAPI auto-documentation

**Frontend (React Native/Expo):**
- Expo Router for file-based navigation
- Zustand for global state management
- React Query (TanStack Query) for server state
- React Hook Form for form handling
- React Native Paper for Material Design components
- Axios with interceptors for API calls

**Data Model (Prisma):**
- PostgreSQL with Prisma ORM
- Key entities: User, Contract, ContractAnalysis, RiskItem
- Type-safe database access with migrations
- Redis for caching and job queues

## Environment Setup

### Prerequisites
- Node.js 18+ and pnpm 8+
- PostgreSQL database
- Redis server
- Google Generative AI API key (for AI analysis)

### Initial Setup
1. Install dependencies: `pnpm install` (in root)
2. Configure environment variables (copy `.env.example` to `.env`)
3. Initialize database: `pnpm --filter=server run db:migrate:dev`
4. Seed database: `pnpm --filter=server run db:seed`
5. Start development servers: `pnpm dev:client` and `pnpm dev:server`

## Code Conventions

### Language
- **All code, comments, and documentation must be in English**
- Variable/function names in English only (e.g., `analyzeContract`, not `分析合同`)
- User-facing text should be clear, professional English

### Client Code Style
- Use `@/*` path alias for imports
- Organize imports: React/Native → components → hooks/utils
- Export prop types as `export type ComponentNameProps`
- Use functional components with TypeScript
- Follow Expo Router conventions for file-based routing

### Server Code Style
- Follow NestJS module/service/controller pattern
- Use class-validator DTOs for request validation
- Implement proper error handling with HTTP exceptions
- Use dependency injection for testability
- Document APIs with Swagger decorators

## Key Implementation Details

### AI Analysis Pipeline
1. File upload → OCR/text extraction
2. Text sent to Google Generative AI (Gemini)
3. AI analyzes for risks, terms, recommendations
4. Results stored as JSON in ContractAnalysis
5. Async processing via Redis Bull queues

### File Processing
- Supports: Images (camera/upload), PDFs, Word documents
- OCR using Tesseract.js for image text extraction
- PDF parsing with pdf-parse and pdfjs-dist
- Word document processing with mammoth

### Authentication
- JWT-based authentication
- Passport.js strategies for local/JWT
- Protected routes with AuthGuard
- Token refresh mechanism

## Important Files for Reference

### Configuration
- `package.json` (root) - Workspace configuration
- `pnpm-workspace.yaml` - Workspace definition
- `client/app.json` - Expo configuration
- `server/prisma/schema.prisma` - Database schema

### Architecture
- `server/src/app.module.ts` - Main NestJS module
- `server/src/main.ts` - Server bootstrap
- `client/app/_layout.tsx` - Root layout
- `client/services/api.ts` - API client setup

### Documentation
- `PRD.md` - Product Requirements Document
- `PROJECT_SUMMARY.md` - Complete project overview
- `AGENTS.md` - Development guidelines and commands
- `QUICKSTART.md` - Setup instructions
- `TASK.md` - 12-week development plan

## Testing Strategy

### Server Tests
- Unit tests: `*.spec.ts` files alongside implementation
- E2E tests: `test/` directory with Supertest
- Database: Test with Prisma test transactions
- Mock external services (AI, OCR)

### Client Tests
- React Native Testing Library
- Component testing with mocked navigation
- API service mocking
- State management testing

## Deployment Notes

### Environment Variables
Required for server:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `JWT_SECRET` - JWT signing secret
- `GOOGLE_AI_API_KEY` - Google Generative AI API key
- `UPLOAD_PATH` - File upload directory

### Production Builds
- Client: `expo build` or EAS build
- Server: `pnpm build` → `pnpm start:prod`
- Database: Run migrations before deployment

## Common Development Tasks

### Adding a New Feature
1. Create module in `server/src/` (NestJS)
2. Define Prisma schema updates if needed
3. Create API endpoints with validation DTOs
4. Implement frontend components in `client/`
5. Add API service methods in `client/services/`
6. Write tests for both backend and frontend

### Database Schema Changes
1. Update `server/prisma/schema.prisma`
2. Generate migration: `pnpm --filter=server run db:migrate:dev`
3. Update Prisma client: `pnpm --filter=server run db:generate`
4. Update TypeScript types if needed

### Debugging
- Client: Use Expo dev tools and React Native Debugger
- Server: Use `pnpm start:debug` and attach debugger
- Database: Use `pnpm db:studio` for visual inspection
- Logs: Check server console and client Metro bundler output