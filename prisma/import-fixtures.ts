import "dotenv/config"
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fixtures from '../data/world-cup-fixtures.json';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Loaded ${fixtures.length} fixtures`);

  for (const fixture of fixtures) {
    console.log(`Importing ${fixture.externalId}...`);
    
    await prisma.team.upsert({
      where: { code: fixture.homeTeamCode },
      update: { name: fixture.homeTeamName },
      create: { name: fixture.homeTeamName, code: fixture.homeTeamCode },
    });

    await prisma.team.upsert({
      where: { code: fixture.awayTeamCode },
      update: { name: fixture.awayTeamName },
      create: { name: fixture.awayTeamName, code: fixture.awayTeamCode },
    });

    const homeTeam = await prisma.team.findUniqueOrThrow({ where: { code: fixture.homeTeamCode } });
    const awayTeam = await prisma.team.findUniqueOrThrow({ where: { code: fixture.awayTeamCode } });

    await prisma.match.upsert({
      where: { slug: fixture.externalId },
      update: {
        kickoffTime: new Date(fixture.kickoffTime),
        stage: fixture.stage,
        status: fixture.status,
        homeScore: fixture.homeScore,
        awayScore: fixture.awayScore,
      },
      create: {
        slug: fixture.externalId,
        homeTeam: { connect: { id: homeTeam.id } },
        awayTeam: { connect: { id: awayTeam.id } },
        kickoffTime: new Date(fixture.kickoffTime),
        stage: fixture.stage,
        status: fixture.status,
        homeScore: fixture.homeScore,
        awayScore: fixture.awayScore,
      },
    });

    console.log(`✓ ${fixture.externalId} done`);
  }

  console.log('Import complete.');
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });