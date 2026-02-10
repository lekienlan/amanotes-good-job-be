# AMA MIDI Backend API

Minimal quickstart to run the API **with Docker (Postgres + Redis + API)**.

## Prerequisites

- **Docker Desktop**
- **Yarn** (only needed if you want to run commands directly in the container)

## 1. Configure environment

Create `.env` (or update it) to use the Docker service hostnames:

```bash
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@db:5432/ama_midi"
DIRECT_URL="postgresql://postgres:postgres@db:5432/ama_midi"
REDIS_URL="redis://redis:6379"

JWT_SECRET=thisisasamplesecret
JWT_ACCESS_EXPIRATION_MINUTES=14400
JWT_REFRESH_EXPIRATION_DAYS=30
```

## 2. Build and start the stack

Run API + Postgres + Redis via Docker Compose:

```bash
docker compose up -d --build
```

## 3. Initialize the database (first time only)

Push the Prisma schema to the Docker Postgres:

```bash
docker compose exec api yarn db:push
```

Seed demo data:

```bash
docker compose exec api yarn prisma:seed
```

### Seeded login accounts

After running the seed command above, you can log in with:

- **Admin**: `admin@example.com` / `password123`
- **User 1**: `user1@example.com` / `password123`
- **User 2**: `user2@example.com` / `password123`

## 4. Access the API and database

- **API base URL**: `http://localhost:3000`
- **Health check**: `http://localhost:3000/api/v1/health`

Docker Postgres connection from local tools (e.g. DBeaver):

- **Host**: `localhost`
- **Port**: `5433` (host port mapped to container `5432`)
- **Database**: `ama_midi`
- **User**: `postgres`
- **Password**: `postgres`
