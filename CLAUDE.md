# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Flexdesk is a workspace/activity scheduling application. The repository is a monorepo with two independent projects:

- **`flexdesk/`** — Spring Boot 3.5 REST API (Java 21, Maven)
- **`flexdesk-front/`** — Angular 20 SPA (TypeScript, npm)

They communicate exclusively over HTTP; there is no shared code between them.

---

## Backend (flexdesk/)

### Commands

```bash
# Run dev server (http://localhost:8080/api)
./mvnw spring-boot:run

# Build
./mvnw clean install

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=FlexdeskApplicationTests
```

Swagger UI is available at `http://localhost:8080/api/swagger-ui/` when running.

### Architecture

**Package layout** under `src/main/java/flexdesk/flexdesk/`:

| Package | Role |
|---|---|
| `authentication/` | JWT filter, auth controller, token service, login/register models |
| `controller/` | REST controllers for Activity, Comment, User |
| `model/` | JPA entities: `User`, `Activity`, `Comment` |
| `repository/` | Spring Data JPA repositories |
| `service/` | `CustomUserDetailsService` (Spring Security integration) |
| `config/` | `SecurityConfig` — filter chain, CORS, BCrypt bean |

**Authentication flow:** Requests pass through a JWT filter that validates the `Authorization: Bearer <token>` header. The `/api/auth/**` endpoints are public; everything else requires authentication. Tokens are issued by `AuthenticationService` and verified per-request — there are no sessions.

**Database:** PostgreSQL on `localhost:5432/flexdesk`. Credentials are currently hardcoded in `application.properties` (`flexdesk_admin` / `465464`). Schema is managed via `schema.sql` (auto-run on startup) with `spring.jpa.hibernate.ddl-auto=update`. Sample data is in `data.sql`.

**CORS** is currently open to all origins — intentional for development, needs restriction before production.

---

## Frontend (flexdesk-front/)

### Commands

```bash
# Install dependencies
npm install

# Dev server (http://localhost:4200, proxies to backend)
npm start

# Production build
npm run build

# Run all tests (Karma + Jasmine)
npm test

# Run tests for a single file
npx ng test --include='**/home.spec.ts'
```

### Architecture

Angular 20 with **zoneless change detection** and **standalone components** (no NgModules). All routing is lazy.

**Key files:**
- `src/app/app.routes.ts` — full route table with lazy-loaded components
- `src/app/app.config.ts` — root providers (HTTP client, animations, calendar, auth interceptor)
- `src/app/auth/auth.interceptor.ts` — automatically injects `Authorization: Bearer` header on every outgoing request
- `src/app/auth/auth.guard.ts` — redirects unauthenticated users to `/login`
- `src/app/services/auth.service.ts` — token storage and login/logout logic

**Component directories** under `src/app/`:
- `home/` — main dashboard
- `login/` — authentication form
- `roomplanning/` — room view with `angular-calendar`
- `personalplanning/` — personal schedule view
- `activity-details/` — detail view for a single activity
- `activity-form/` — create/edit activity form
- `confirmation-dialog/` — reusable Material dialog

**UI:** Angular Material 20 throughout. Date handling uses `date-fns` 4.

### TypeScript

Strict mode is fully enabled (`strict`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `strictTemplates`, `strictInjectionParameters`). All new code must satisfy the strict compiler.

### Formatting

Prettier is configured inline in `package.json` (no separate `.prettierrc`):
- `printWidth: 100`
- `singleQuote: true`
- HTML files use the `angular` parser

There is no ESLint configuration.
