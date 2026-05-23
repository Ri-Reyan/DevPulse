# DevPluse

## Project Overview

DevPluse is a TypeScript-based Express application for managing issues with user authentication and role-based access control. It provides a simple API for registering users, authenticating with JWT, and creating, reading, updating, and deleting issue reports.

## Key Features

- User signup and login with password hashing
- JWT-based authentication and protected routes
- Role-based issue management (`contributor`, `maintainer`)
- Issue filtering by type and status
- PostgreSQL database setup and table initialization at startup
- Centralized error handling and consistent API response format

## Tech Stack

- Node.js + TypeScript
- Express
- PostgreSQL via `pg`
- JWT authentication
- `bcrypt` for password hashing
- `dotenv` for environment variables
- `tsx` for development execution

## Project Structure

- `src/server.ts` - HTTP server bootstrap and DB initialization
- `src/app.ts` - Express application setup, middleware, and routes
- `src/config/db.ts` - PostgreSQL pool and database schema initialization
- `src/config/secretEnvs.ts` - environment configuration loader
- `src/modules/auth` - authentication routes, controller, and service
- `src/modules/issues` - issue management routes, controller, and service
- `src/middlewares/auth.middleware.ts` - request authentication middleware
- `src/utils` - global error handler, response utility, JWT token generator
- `src/types/allTypes.ts` - shared TypeScript response types

## Database Schema

The app auto-creates the necessary tables when started if they do not already exist.

### `users`

- `id` - primary key
- `name` - required
- `email` - unique and required
- `password` - hashed password required
- `role` - `contributor` or `maintainer` (default: `contributor`)
- `created_at`, `updated_at`

### `issues`

- `id` - primary key
- `title` - required
- `description` - required, minimum length 20 characters
- `type` - must be `bug` or `feature_request`
- `status` - one of `open`, `in_progress`, `resolved` (default: `open`)
- `reporter_id` - references the reporting user
- `created_at`, `updated_at`

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=5000
NEON_STRING=<your_postgres_connection_string>
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development
```

## Running the App

Install dependencies:

```bash
npm install
```

Start the server in development mode:

```bash
npm run dev
```

The server listens on `http://localhost:<PORT>`.

## API Endpoints

### Authentication

#### `POST /api/auth/signup`

Register a new user.

Request body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securePassword"
}
```

Response:

- `201 Created` when successful
- returns a JWT cookie and user payload

#### `POST /api/auth/login`

Authenticate an existing user.

Request body:

```json
{
  "email": "alice@example.com",
  "password": "securePassword"
}
```

Response:

- `200 OK` when successful
- returns a JWT cookie and user info + token

### Issues

#### `POST /api/issues`

Create a new issue.

Requires `Authorization: Bearer <token>` header.

Request body:

```json
{
  "title": "Bug in login flow",
  "description": "Unable to log in when using X browser...",
  "type": "bug",
  "status": "open"
}
```

Response:

- `201 Created` with created issue data

#### `GET /api/issues`

Fetch all issues.

Query parameters:

- `sort=oldest` or defaults to newest first
- `type=bug|feature_request`
- `status=open|in_progress|resolved`

Response:

- `200 OK` with array of issues and reporter metadata

#### `GET /api/issues/:id`

Fetch a single issue by ID.

Response:

- `200 OK` with issue details
- `404 Not Found` if the issue does not exist

#### `PATCH /api/issues/:id`

Update an issue.

Requires `Authorization: Bearer <token>` header.

Rules:

- Contributors can update only their own issues
- Contributors may update issues only while status is `open`
- Maintainers may update any issue

Response:

- `200 OK` with updated issue data
- `403 Forbidden` or `409 Conflict` for invalid update attempts

#### `DELETE /api/issues/:id`

Delete an issue.

Requires `Authorization: Bearer <token>` header.

Rules:

- Only `maintainer` role may delete issues

Response:

- `200 OK` on success
- `403 Forbidden` for unauthorized deletion

## Authentication Flow

- User signup and login both generate a JWT token.
- Token is stored in a cookie named `accessToken`.
- Protected issue routes use `Authorization: Bearer <token>`.
- JWT payload contains `id`, `name`, and `role`.

## Error Handling

- Global error middleware returns structured JSON responses.
- Client receives `success: false`, an error message, and details if available.
- Common error codes used:
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `500 Internal Server Error`

## Notes

- The app uses CORS with `origin` set to `http://localhost:<PORT>` and supports credentials.
- The database initializes automatically on startup, so the app can create required tables when launched.
- The response utility centralizes JSON formatting for status, message, and data.

## Development

The development script uses `tsx watch` to run TypeScript directly from `src/server.ts`.

```bash
npm run dev
```

---
