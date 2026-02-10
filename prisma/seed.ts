import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
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

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
