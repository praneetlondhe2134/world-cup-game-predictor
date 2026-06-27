import fixtures from '../data/world-cup-fixtures.json';

async function main() {
  console.log(`Loaded ${fixtures.length} fixtures`);

  for (const fixture of fixtures) {
    console.log(`- ${fixture.externalId}`);
  }

  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});