# Supabase Setup Guide

Complete guide to set up Supabase PostgreSQL for this project.

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project** (free, no credit card required)
3. Sign up with GitHub, Google, or email
4. Click **New Project**
5. Fill in the details:
   - **Name**: `ama-midi-backend` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine for development
6. Click **Create new project**
7. Wait ~2 minutes for database provisioning

## Step 2: Get Connection Strings

1. In your Supabase project, go to **Project Settings** (gear icon)
2. Click **Database** in the left sidebar
3. Scroll down to **Connection String** section
4. You'll see two connection modes:

### Session Mode (Direct Connection)
- **Port**: 5432
- **Use for**: Migrations, Prisma Studio, long-running connections
- Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Transaction Mode (Pooled Connection)
- **Port**: 6543 (PgBouncer)
- **Use for**: Application runtime, serverless deployments
- Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Step 3: Configure Environment Variables

1. Open `.env` in your project root
2. Add both connection strings:

```bash
# Direct connection for migrations and Prisma Studio
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Pooled connection for application runtime
DATABASE_POOLER_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password!

## Step 4: Run Migrations

Create the database tables in Supabase:

```bash
# Generate Prisma Client
yarn prisma:generate

# Create and apply migration
yarn prisma:migrate

# When prompted, name your migration (e.g., "init")
```

## Step 5: Seed Database (Optional)

Add demo users to your database:

```bash
yarn prisma:seed
```

This creates:
- Admin user: `admin@example.com` / `password123`
- Regular user: `user@example.com` / `password123`

## Step 6: Verify Setup

### Option A: Prisma Studio
```bash
yarn prisma:studio
```
Opens at `http://localhost:5555` - browse your Supabase tables

### Option B: Supabase Dashboard
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. You should see your `users` table with data (if you ran seed)

## Common Issues & Solutions

### Issue: "Can't reach database server"
**Solution:** Check your firewall/network settings. Supabase requires internet access.

### Issue: "Authentication failed"
**Solution:** Double-check your password in the connection string. Make sure you replaced `[YOUR-PASSWORD]`.

### Issue: "Too many connections"
**Solution:** Use `DATABASE_POOLER_URL` for your application. The pooler (port 6543) manages connections efficiently.

### Issue: "Migration failed"
**Solution:** Make sure you're using `DATABASE_URL` (port 5432, not pooler) for migrations.

## Supabase Free Tier Limits

- **Database Size**: 500 MB
- **Bandwidth**: 2 GB
- **Projects**: 2 active projects
- **API Requests**: Unlimited
- **Paused after**: 1 week of inactivity (auto-resumes on access)

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use different databases** for development/staging/production
3. **Rotate passwords** periodically in Supabase Dashboard
4. **Enable Row Level Security (RLS)** in Supabase for production
5. **Use environment-specific projects** on Supabase

## Next Steps

- [ ] Set up Row Level Security policies in Supabase
- [ ] Configure authentication (Supabase Auth + JWT)
- [ ] Set up automated backups (available in paid plans)
- [ ] Add database indexes for performance
- [ ] Monitor query performance in Supabase Dashboard

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://www.prisma.io/docs/guides/database/supabase)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool)
