# Agent Guidelines for Contract Assistant

## UI Design Reference

The mobile app design mockups and specifications are available in `contract-assistant-ui.html`. This includes:
- **6 Screen Designs**: Home, Loading, Analysis Results, Detailed Analysis, Risk Details, User Profile
- **Feature Modules**: File upload, AI analysis, results display, data management, user center, security
- **Design System**: Color palette (purple-blue gradient primary), typography, component specs
- **Tech Stack**: React Native/Flutter frontend, OpenAI/Claude AI services, OCR integration

When implementing UI components, refer to this design document for layout, styling, and user flow consistency.

## Build, Lint & Test Commands

**Package Manager**: This project uses `pnpm` (not npm/yarn)

### Client (React Native/Expo) - `/client`
- **Install**: `pnpm install` - Install dependencies
- **Lint**: `pnpm lint` - ESLint with Expo config
- **Start**: `pnpm start` - Expo dev server
- **Platform**: `pnpm android|ios|web` - Platform-specific
- **Reset**: `pnpm reset-project` - Move starter code to app-example/

### Server (NestJS) - `/server`
- **Install**: `pnpm install` - Install dependencies
- **Build**: `pnpm build` - Compile TypeScript
- **Lint**: `pnpm lint` - ESLint with auto-fix
- **Format**: `pnpm format` - Prettier formatting
- **Start Dev**: `pnpm start:dev` - Watch mode
- **Test**: `pnpm test` - Run all tests
- **Test Single**: `pnpm test -- app.service.spec.ts` - Run specific test file
- **Test Watch**: `pnpm test:watch` - Watch mode
- **Test Coverage**: `pnpm test:cov` - With coverage
- **E2E Tests**: `pnpm test:e2e` - End-to-end tests

### Root (Workspace) - `/`
- **Install All**: `pnpm install` - Install all workspace dependencies
- **Clean**: `pnpm store prune` - Clean pnpm store

## Code Style & Conventions

### Language
- **Primary Language**: English - All code, comments, UI text, documentation, and commit messages must be in English
- **User-Facing Text**: Use clear, professional English; avoid slang or regional expressions
- **Variable/Function Names**: English only (e.g., `analyzeContract`, not `分析合同`)
- **Localization**: If i18n is added later, English remains the default/fallback language

### Client (React Native/Expo)
- **Imports**: Use `@/*` path alias; organize React/Native → components → hooks/utils
- **Types**: Strict mode enabled; export prop types as `export type ComponentNameProps`
- **Components**: Named exports (`export function Component()`); functional only
- **Styles**: Use `StyleSheet.create()` at file end; theme colors via `useThemeColor`
- **Files**: kebab-case names (`themed-text.tsx`); UI in `components/ui/`; hooks in `hooks/`
- **Formatting**: 2-space indent; auto-format on save; max 100 chars/line

### Server (NestJS)
- **Imports**: NestJS decorators first, then dependencies, then local
- **Types**: Use TypeScript decorators (`@Injectable()`, `@Controller()`)
- **Structure**: Module → Controller → Service pattern; dependency injection via constructor
- **Files**: kebab-case with suffix (`user.service.ts`, `user.controller.ts`)
- **Formatting**: Single quotes; trailing commas; Prettier config in `.prettierrc`
- **Testing**: Test files alongside source (`*.spec.ts`); E2E in `/test`

### Error Handling
- **Client**: No silent try-catch; log or propagate errors meaningfully
- **Server**: Use NestJS exception filters; throw `HttpException` or custom exceptions
- **Both**: Validate all external data; use TypeScript exhaustiveness checking
