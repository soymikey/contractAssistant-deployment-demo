# Contract Assistant GEMINI.md

This file provides a comprehensive overview of the Contract Assistant project, its architecture, and development conventions. It's intended to be used as a quick-start guide for developers and as a context for AI-powered development tools.

## Project Overview

Contract Assistant is a monorepo project that consists of a mobile application (client), a backend server, and an official website. The project is designed to assist users with their contracts, although the exact functionality is not detailed in the available documentation.

### Technologies

*   **Client (Mobile App):**
    *   Framework: React Native with Expo
    *   Language: TypeScript
    *   Navigation: React Navigation
    *   Data Fetching: Tanstack Query
    *   State Management: Zustand
*   **Backend (Server):**
    *   Framework: NestJS
    *   Language: TypeScript
    *   ORM: Prisma
    *   Authentication: Passport.js
    *   Task Queues: Bull
*   **Official Website:**
    *   The technologies used for the official website are not specified in the project's configuration files.

### Architecture

The project is structured as a monorepo with three main packages:

*   `client`: Contains the source code for the React Native mobile application.
*   `server`: Contains the source code for the NestJS backend server.
*   `official-website`:  Intended for the project's official website, but the implementation is not available.

## Building and Running

### Prerequisites

*   [Node.js](https://nodejs.org/)
*   [pnpm](https://pnpm.io/)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/)
*   A database supported by Prisma (e.g., PostgreSQL, MySQL, SQLite)

### Development

To run the project in development mode, you need to start both the client and the server.

1.  **Start the server:**

    ```bash
    pnpm dev:server
    ```

2.  **Start the client:**

    ```bash
    pnpm dev:client
    ```

### Testing

*   **Server:**

    ```bash
    pnpm --filter=server run test
    ```

*   **Client:**

    At the moment, there are no explicit test scripts for the client in the root `package.json`. You may need to run the tests from the `client` directory.

## Development Conventions

### Coding Style

The project uses Prettier for code formatting. You can format the code using the following command from the root directory:

```bash
pnpm --filter=client run format
pnpm --filter=server run format
```

### Linting

The project uses ESLint for linting. You can lint the code using the following command from the root directory:

```bash
pnpm --filter=client run lint
pnpm --filter=server run lint
```
