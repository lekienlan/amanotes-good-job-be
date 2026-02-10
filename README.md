# AMA MIDI Backend API

REST API Boilerplate with Node.js, TypeScript, Express, Prisma, and Supabase PostgreSQL.

## Features

- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe development
- **Prisma ORM** - Modern database toolkit with Prisma 7
- **Supabase** - Hosted PostgreSQL with connection pooling
- **Winston** - Logging
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks for code quality

## Getting Started

### Prerequisites

- Node.js (v16+)
- Yarn
- Docker Desktop (recommended for local DB via Docker Compose)

### Installation

1. Clone the repository and install dependencies:

```bash
yarn install
```

2. Choose your database setup:

#### Option A: Local DB with Docker (recommended)

This runs **Postgres + Redis + API** locally via Docker Compose.

1. Update `.env` to use Docker service hostnames (already supported by this repo):

```bash
DATABASE_URL="postgresql://postgres:postgres@db:5432/ama_midi"
DIRECT_URL="postgresql://postgres:postgres@db:5432/ama_midi"
REDIS_URL="redis://redis:6379"
```

2. Start the stack (API + Postgres + Redis):

```bash
docker compose up -d --build
```

3. Initialize the database schema (first time on a fresh DB):

```bash
docker compose exec api yarn db:push
```

4. (Optional) Seed demo data:

```bash
docker compose exec api yarn prisma:seed
```

5. Access the API:

- API base URL: `http://localhost:3000`
- Health check: `http://localhost:3000/api/v1/health`

6. Connect to the Docker Postgres from tools like DBeaver:

- Host: `localhost`
- Port: `5433` (host port mapped to container `5432`)
- Database: `ama_midi`
- User: `postgres`
- Password: `postgres`

#### Option B: Hosted DB with Supabase

If you prefer Supabase-hosted Postgres, follow `SUPABASE_SETUP.md` and set `DATABASE_URL`/`DIRECT_URL` accordingly.

3. (Supabase only) Get your database connection strings:

   - Go to **Project Settings** > **Database**
   - Scroll to **Connection String** section
   - Copy both:
     - **Session mode** (port 5432) for `DATABASE_URL`
     - **Transaction mode** (port 6543) for `DATABASE_POOLER_URL`

4. (Supabase only) Copy and configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase connection strings:

```bash
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@...supabase.com:5432/postgres"
DATABASE_POOLER_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@...supabase.com:6543/postgres?pgbouncer=true"
```

### Database Setup

5. Generate Prisma Client:

```bash
yarn prisma:generate
```

6. Run database migrations to create tables in Supabase:

```bash
yarn prisma:migrate
```

This will prompt you to name your migration and apply it to your Supabase database.

7. (Optional) Seed the database with sample data:

```bash
yarn prisma:seed
```

This creates two demo users:

- Admin: `admin@example.com` / `password123`
- User: `user@example.com` / `password123`

### Running the Server

Development mode with hot reload:

```bash
yarn dev
```

Production build:

```bash
yarn build
yarn start
```

The API will be available at `http://localhost:3000`

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── prisma.config.ts   # Prisma 7 datasource config
│   └── seed.ts            # Database seeding script
├── src/
│   ├── config/
│   │   ├── config.ts      # App configuration
│   │   ├── logger.ts      # Winston logger
│   │   ├── prisma.ts      # Prisma client with Supabase adapter
│   │   └── index.ts       # Config exports
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── validations/       # Request validation schemas
│   ├── utils/             # Helper functions
│   ├── app.ts             # Express app configuration
│   └── index.ts           # Server entry point
└── package.json
```

## Environment Variables

Configure these in your `.env` file for local Docker:

```bash
# Server
PORT=3000
NODE_ENV=development

# Docker Postgres (service hostnames)
DATABASE_URL="postgresql://postgres:postgres@db:5432/ama_midi"
DIRECT_URL="postgresql://postgres:postgres@db:5432/ama_midi"

# Redis
REDIS_URL="redis://redis:6379"

# JWT (if using authentication)
JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=14400
JWT_REFRESH_EXPIRATION_DAYS=30
```

For Supabase-hosted Postgres, see `SUPABASE_SETUP.md` and use the Supabase connection strings instead.

## Available Scripts

### Development

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn start` - Start production server

### Database (Prisma)

- `yarn prisma:generate` - Generate Prisma Client
- `yarn prisma:migrate` - Create and apply migrations
- `yarn prisma:migrate:deploy` - Deploy migrations (production)
- `yarn prisma:studio` - Open Prisma Studio (database GUI)
- `yarn prisma:seed` - Seed the database
- `yarn db:push` - Push schema changes without migrations
- `yarn db:pull` - Pull schema from existing database
- `yarn db:reset` - Reset database and apply migrations

### Code Quality

- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier

## Database Models

### User Model

```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  name            String?
  password        String
  role            Role     @default(USER)
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
````

## Using Prisma Client

Import and use Prisma client in your code:

```typescript
import { prisma } from './config';

// Find all users
const users = await prisma.user.findMany();

// Create a user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: hashedPassword
  }
});

// Update a user
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Jane Doe' }
});
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/v1` - API v1 endpoints

## Supabase Tips

### Access Supabase Dashboard

- Go to [app.supabase.com](https://app.supabase.com)
- Select your project
- Use **Table Editor** to view/edit data directly
- Use **SQL Editor** to run custom queries

### View Database Locally

Use Prisma Studio for a local GUI:

```bash
yarn prisma:studio
```

This opens a web interface at `http://localhost:5555` to browse and edit your Supabase database.

### Reset Database

To reset your database and re-run all migrations:

```bash
yarn db:reset
```

**Warning:** This will delete all data in your Supabase database!

### Connection Pooling

The app automatically uses:

- `DATABASE_POOLER_URL` (port 6543) for application connections - recommended for serverless
- `DATABASE_URL` (port 5432) for migrations and Prisma Studio

### Monitor Connections

Check active database connections in Supabase Dashboard:

- **Reports** > **Database** > **Active Connections**

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

ISC
