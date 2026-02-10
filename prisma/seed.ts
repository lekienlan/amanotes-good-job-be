import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';
import { PREDEFINED_CORE_VALUES } from '../src/modules/core_value/core_values.types';
import { PREDEFINED_REWARDS } from '../src/modules/reward/reward.types';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed predefined core values if they do not exist yet (by name).
  for (const value of PREDEFINED_CORE_VALUES) {
    // Reason: schema does not enforce unique(name), so we guard duplicates manually.
    const existing = await prisma.coreValue.findFirst({
      where: { name: value.name }
    });

    if (!existing) {
      await prisma.coreValue.create({ data: value });
    }
  }

  // Seed predefined rewards if they do not exist yet (by name).
  for (const reward of PREDEFINED_REWARDS) {
    // Reason: rewards may be edited later, but initial set should not duplicate on reseed.
    const existing = await prisma.reward.findFirst({
      where: { name: reward.name }
    });

    if (!existing) {
      await prisma.reward.create({ data: reward });
    }
  }

  // Seed default users (1 admin, 2 regular users) if they do not exist yet.
  // Reason: we want a simple, predictable set of demo accounts for local development.
  const commonPasswordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    // Cast is required until Prisma types are regenerated with the new user_name field.
    create: {
      user_name: 'admin',
      email: 'admin@example.com',
      password: commonPasswordHash,
      first_name: 'Admin',
      last_name: 'User',
      role: Role.ADMIN,
      giving_budget: 200
    } as any
  });

  await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      user_name: 'user1',
      email: 'user1@example.com',
      password: commonPasswordHash,
      first_name: 'User',
      last_name: 'One',
      role: Role.USER,
      giving_budget: 200
    } as any
  });

  await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      user_name: 'user2',
      email: 'user2@example.com',
      password: commonPasswordHash,
      first_name: 'User',
      last_name: 'Two',
      role: Role.USER,
      giving_budget: 200
    } as any
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
