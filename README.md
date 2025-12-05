# LAN Party Manager API

REST API to manage games and gaming stations during a LAN party.

## Installation

```bash
npm install
```

## Database Setup

This project uses **Prisma 7** with SQLite for data persistence.

```bash
# Run migrations (creates database)
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed

# Open Prisma Studio (visual database browser)
npx prisma studio
```

## Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run start
```

Server starts on `http://localhost:3000`.

## Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production/test) | development |
| DATABASE_URL | SQLite database path | file:./dev.db |
| JWT_SECRET | Secret for JWT tokens (min 32 chars) | - |
| JWT_EXPIRES_IN | Token expiration time | 24h |

Environment validation is handled by **Zod** in `src/config/env.js`. The server won't start if required variables are missing or invalid.

## Architecture

This project follows the **MVC pattern** adapted for Node.js/Express:

```
Routes → Controllers → Services → Prisma (Database)
```

- **Routes**: Define endpoints and apply middlewares (validation)
- **Controllers**: Handle HTTP request/response, delegate to services
- **Services**: Business logic and database operations
- **Utils**: Reusable helpers (asyncHandler, responseHelper)

### API Response Format

All API responses follow a standardized format:

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication with **bcrypt** for password hashing.

### Authentication Flow

1. **Register**: `POST /api/auth/register` - Create account
2. **Login**: `POST /api/auth/login` - Get JWT token
3. **Use token**: Include in header `Authorization: Bearer <token>`

### Protected Routes

| Access Level | Routes |
|--------------|--------|
| Public | GET routes (read-only) |
| Authenticated | POST, PUT, DELETE on games and stations |
| Admin only | User management (`/api/users/*`) |

### Web Session

For EJS views, sessions are used to maintain authentication state. Login/register forms are available at `/login` and `/register`.

### Roles

- **user**: Default role, can manage games and stations
- **admin**: Full access including user management

## Web Pages (EJS)

| Route | Description |
|-------|-------------|
| / | Home page with stats |
| /login | Login form |
| /register | Registration form |
| /admin/users | User management (admin only) |
| /games | Games list with CRUD actions |
| /games/new | Create new game form |
| /games/:id | Game details |
| /games/:id/edit | Edit game form |
| /stations | Stations list with CRUD actions |
| /stations/new | Create new station form |
| /stations/:id | Station details |
| /stations/:id/edit | Edit station form |

## API Routes

### Documentation
- **Swagger UI**: `http://localhost:3000/api-docs`

### Games
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/games | List games (filters: genre, limit, offset) |
| GET | /api/games/:id | Get game by ID |
| POST | /api/games | Create game |
| PUT | /api/games/:id | Update game |
| DELETE | /api/games/:id | Delete game |

### Stations
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/stations | List stations (filters: status, limit, offset) |
| GET | /api/stations/:id | Get station by ID |
| POST | /api/stations | Create station (auth required) |
| PUT | /api/stations/:id | Update station (auth required) |
| DELETE | /api/stations/:id | Delete station (auth required) |

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create new account |
| POST | /api/auth/login | Login and get JWT token |
| GET | /api/auth/me | Get current user (auth required) |

### Users (Admin only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/users | List all users |
| GET | /api/users/:id | Get user by ID |
| DELETE | /api/users/:id | Delete user |

## Project Structure

```
lan-party/
├── prisma/
│   ├── schema.prisma      # Database schema (Game, Station, User)
│   ├── migrations/        # Database migrations
│   └── seed.js            # Seed script
├── src/
│   ├── config/
│   │   ├── env.js         # Environment validation (Zod)
│   │   ├── prisma.js      # Prisma client instance
│   │   └── swagger.js     # OpenAPI configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── gameController.js
│   │   ├── stationController.js
│   │   ├── userController.js
│   │   ├── viewAdminController.js
│   │   └── viewAuthController.js
│   ├── middlewares/
│   │   ├── authenticate.js # JWT token verification
│   │   ├── authorize.js   # Role-based access control
│   │   ├── logger.js      # Request logging
│   │   ├── errorHandler.js # Centralized error handling
│   │   ├── notFound.js    # 404 handler
│   │   └── validate.js    # Zod validation middleware
│   ├── routes/
│   │   ├── index.js       # API routes aggregator
│   │   ├── authRoutes.js  # Auth API routes + Swagger docs
│   │   ├── gameRoutes.js  # Games API routes + Swagger docs
│   │   ├── stationRoutes.js # Stations API routes + Swagger docs
│   │   ├── userRoutes.js  # Users API routes (admin)
│   │   ├── viewAdminRoutes.js # Admin pages routes
│   │   ├── viewAuthRoutes.js # Auth pages routes
│   │   └── viewRoutes.js  # HTML page routes
│   ├── schemas/
│   │   ├── gameSchema.js  # Zod schema for games
│   │   └── stationSchema.js # Zod schema for stations
│   ├── services/
│   │   ├── authService.js # Authentication logic
│   │   ├── gameService.js # Game business logic
│   │   └── stationService.js # Station business logic
│   ├── utils/
│   │   ├── asyncHandler.js # Async error wrapper
│   │   ├── responseHelper.js # Standardized API responses
│   │   └── icons.js       # Lucide icons helper
│   ├── public/
│   │   └── css/
│   │       ├── input.css  # Tailwind source
│   │       └── style.css  # Generated CSS
│   ├── views/
│   │   ├── partials/      # head, header, footer, deleteModal
│   │   └── pages/         # home, error, auth/, admin/, games/, stations/
│   └── server.js          # Entry point
├── prisma.config.ts       # Prisma configuration
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment template
└── package.json
```

## Features

- **MVC Architecture** with clear separation of concerns
- **Prisma 7 ORM** with SQLite database
- **EJS templates** with server-side rendering
- **Tailwind CSS** for styling
- **Lucide icons** (lucide-static)
- Complete CRUD operations for Games and Stations
- OpenAPI 3.0 documentation with Swagger UI
- **Zod validation** with French error messages
- **Custom middlewares** (logger, errorHandler, notFound, validate)
- **Standardized API responses** with success/error format
- **Environment configuration** with dotenv and Zod validation
- **JWT authentication** with bcrypt password hashing
- **Role-based access control** (user/admin)
- **Session support** for web views
- Filters and pagination
- Colored logs (chalk)
- Async/await error handling with asyncHandler

## Middlewares

The application uses custom Express middlewares:

1. **logger** - Logs HTTP requests with method, URL, status code, and duration
2. **errorHandler** - Centralized error handling (JSON for API, HTML for views)
3. **notFound** - Handles 404 errors for undefined routes
4. **validate(schema)** - Factory middleware for Zod schema validation
5. **authenticate** - Verifies JWT token from Authorization header
6. **authorize(...roles)** - Restricts access to specific roles

### Middleware Order (Critical)

```javascript
app.use(logger)           // First: log all requests
app.use(express.json())   // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))
app.use('/', viewRoutes)  // View routes
app.use('/api', apiRoutes) // API routes (aggregated)
app.use(notFound)         // After all routes
app.use(errorHandler)     // Last: catch all errors
```

## Utils

### asyncHandler

Wraps async route handlers to automatically catch errors:

```javascript
export const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

### responseHelper

Standardizes API JSON responses:

```javascript
export const success = data => ({ success: true, data })
export const created = data => ({ success: true, data })
export const error = (message, status) => ({ success: false, error: message })
```

## Validation

Data validation is handled by **Zod** schemas with French error messages:

```javascript
// Example: gameSchema.js
import { z } from 'zod'

export const gameSchema = z.object({
  name: z.string({ required_error: 'Le nom est requis' }).min(1),
  genre: z.string({ required_error: 'Le genre est requis' }).min(1),
  minPlayers: z.number().int().min(1),
  maxPlayers: z.number().int().min(1),
  // ...
}).refine(data => data.minPlayers <= data.maxPlayers, {
  message: 'Le minimum de joueurs ne peut pas depasser le maximum',
  path: ['minPlayers']
})
```

## Database Models

### Game
- `id`: Auto-increment primary key
- `name`: Game name
- `genre`: Game genre (FPS, MOBA, etc.)
- `releaseYear`: Optional release year
- `minPlayers`, `maxPlayers`: Player count range
- `description`: Optional description
- `createdAt`, `updatedAt`: Timestamps

### Station
- `id`: Auto-increment primary key
- `name`: Station name
- `cpu`, `gpu`, `ram`, `storage`: Hardware specs
- `monitor`, `keyboard`, `mouse`, `headset`: Peripherals
- `status`: available | maintenance | booked
- `createdAt`, `updatedAt`: Timestamps

### User
- `id`: Auto-increment primary key
- `username`: Unique username
- `email`: Unique email
- `password`: Hashed password (bcrypt)
- `role`: user | admin
- `createdAt`, `updatedAt`: Timestamps
