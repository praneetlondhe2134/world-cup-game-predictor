import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

type Team = {
    name: string;
    code: string;
    group?: string; 
};

const demoTeams: Team[] = [
    { name: 'Australia', code: 'AUS', group: 'A' },
    { name: 'Brazil', code: 'BRA', group: 'B' },
    { name: 'France', code: 'FRA', group: 'B' }, 
    { name: 'Japan', code: 'JPN', group: 'A' },
];

async function seedTeams() {
    for(const team of demoTeams) {
        await prisma.team.upsert({
            where: {
                code: team.code,
            },
            update: {
                name: team.name,
                group: team.group ?? null,
            },
            create: {
                code: team.code,
                name: team.name,
                group: team.group,
            },
        });
    }
}

async function seedMatches() {
    const teamAUS = await prisma.team.findUniqueOrThrow({ where: { code: 'AUS' } });
    const teamBRA = await prisma.team.findUniqueOrThrow({ where: { code: 'BRA' } });
    const teamFRA = await prisma.team.findUniqueOrThrow({ where: { code: 'FRA' } });
    const teamJPN = await prisma.team.findUniqueOrThrow({ where: { code: 'JPN' } });
  
    // Match 1: AUS vs JPN
    await prisma.match.upsert({
      where: { slug: 'aus-jpn-2026' },
      update: {
        kickoffTime: new Date("2026-06-15T10:00:00Z"),
        stage: "Group",
        status: "scheduled",
      },
      create: {
        slug: 'aus-jpn-2026',
        homeTeam: { connect: { id: teamAUS.id } },
        awayTeam: { connect: { id: teamJPN.id } },
        kickoffTime: new Date("2026-06-15T10:00:00Z"),
        stage: "Group",
        status: "scheduled",
      },
    });
  
    // Match 2: BRA vs FRA
    await prisma.match.upsert({
      where: { slug: 'bra-fra-2026' },
      update: {
        kickoffTime: new Date("2026-06-15T14:00:00Z"),
        stage: "Group",
        status: "scheduled",
      },
      create: {
        slug: 'bra-fra-2026',
        homeTeam: { connect: { id: teamBRA.id } },
        awayTeam: { connect: { id: teamFRA.id } },
        kickoffTime: new Date("2026-06-15T14:00:00Z"),
        stage: "Group",
        status: "scheduled",
      },
    });
  }
  

async function main() {
    await seedTeams();
    await seedMatches();
    
    console.log('Seeding completed successfully!');
  }
  
  main()
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });