# Agent Guidelines for Contract Assistant

## UI Design Reference

The mobile app design mockups and specifications are available in `contract-assistant-ui.html`. This includes:
- **6 Screen Designs**: Home, Loading, Analysis Results, Detailed Analysis, Risk Details, User Profile
- **Feature Modules**: File upload, AI analysis, results display, data management, user center, security
- **Design System**: Color palette (purple-blue gradient primary), typography, component specs
- **Tech Stack**: React Native/Flutter frontend, OpenAI/Claude AI services, OCR integration

When implementing UI components, refer to this design document for layout, styling, and user flow consistency.

## Build, Lint & Test Commands

### Client (React Native/Expo) - `/client`
- **Lint**: `npm run lint` - ESLint with Expo config
- **Start**: `npm start` - Expo dev server
- **Platform**: `npm run android|ios|web` - Platform-specific
- **Reset**: `npm run reset-project` - Move starter code to app-example/

### Server (NestJS) - `/server`
- **Build**: `npm run build` - Compile TypeScript
- **Lint**: `npm run lint` - ESLint with auto-fix
- **Format**: `npm run format` - Prettier formatting
- **Start Dev**: `npm start:dev` - Watch mode
- **Test**: `npm test` - Run all tests
- **Test Single**: `npm test -- app.service.spec.ts` - Run specific test file
- **Test Watch**: `npm test:watch` - Watch mode
- **Test Coverage**: `npm test:cov` - With coverage
- **E2E Tests**: `npm test:e2e` - End-to-end tests

## Code Style & Conventions

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
