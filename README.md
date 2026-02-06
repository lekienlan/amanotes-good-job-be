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
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository and install dependencies:

```bash
yarn install
```

2. Create a Supabase project:
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Wait for the database to be provisioned (~2 minutes)

3. Get your database connection strings:
   - Go to **Project Settings** > **Database**
   - Scroll to **Connection String** section
   - Copy both:
     - **Session mode** (port 5432) for `DATABASE_URL`
     - **Transaction mode** (port 6543) for `DATABASE_POOLER_URL`

4. Copy and configure environment variables:

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

Configure these in your `.env` file:

```bash
# Server
PORT=3000
NODE_ENV=development

# Supabase Database
# Get from: Supabase Dashboard > Project Settings > Database > Connection String
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@...supabase.com:5432/postgres"
DATABASE_POOLER_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@...supabase.com:6543/postgres?pgbouncer=true"

# JWT (if using authentication)
JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30

# SMTP (if using email)
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

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
```

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
    password: hashedPassword,
  },
});

// Update a user
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Jane Doe' },
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
