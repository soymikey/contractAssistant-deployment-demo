# Contract Assistant

A comprehensive contract management and analysis platform featuring a mobile application and a robust backend.

## 🏗 Project Structure

This project is a monorepo managed with `pnpm` workspaces:

-   **`client/`**: Cross-platform mobile application built with **React Native** and **Expo**.
-   **`server/`**: Backend API built with **NestJS**, using **Prisma ORM** and **Bull** for task queuing.
-   **`official-website/`**: Project landing page.

## 🚀 Quick Start

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [pnpm](https://pnpm.io/)
-   [Expo Go](https://expo.dev/expo-go) (for mobile testing)
-   [Docker](https://www.docker.com/) (recommended for Redis/Database)

### Installation

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Environment Setup:**
    -   Copy `.env.example` to `.env` in both `client/` and `server/` directories and fill in the required values.

3.  **Database Initialization:**
    ```bash
    cd server
    pnpm db:generate
    pnpm db:migrate:dev
    ```

### Running the Application

From the root directory:

-   **Start Backend (Dev):**
    ```bash
    pnpm dev:server
    ```
-   **Start Mobile Client:**
    ```bash
    pnpm dev:client
    ```

## 🛠 Tech Stack

### Client (Mobile)
- **Framework:** React Native / Expo (Router)
- **UI:** React Native Paper, Lucide Icons
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Logic:** TypeScript, React Hook Form

### Server (Backend)
- **Framework:** NestJS
- **ORM:** Prisma
- **AI Integration:** Google Generative AI (Gemini)
- **Auth:** Passport.js (JWT)
- **Queue:** Bull (Redis)
- **Documentation:** Swagger (OpenAPI)

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev:server` | Starts the NestJS server in watch mode. |
| `pnpm dev:client` | Starts the Expo development server. |
| `pnpm install` | Installs dependencies for all workspaces. |

---
*For more detailed technical information, refer to [GEMINI.md](./GEMINI.md) and [PRD.md](./PRD.md).*
