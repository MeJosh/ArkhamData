import { fetchCards } from './fetch-cards.js';
import { fetchCampaigns } from './fetch-campaigns.js';

async function main() {
  console.log('=== Fetching data from API ===\n');

  await fetchCards();
  console.log('');
  await fetchCampaigns();

  console.log('\n=== Done ===');
}

main().catch((err) => {
  console.error('Failed to fetch data:', err);
  process.exit(1);
});
