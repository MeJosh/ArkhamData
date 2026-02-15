import { writeFileSync, mkdirSync } from 'fs';
import { fetchJson } from './lib/api-client.js';
import type { Pack, Card } from './lib/types.js';

export async function fetchCards() {
  console.log('Fetching packs...');
  const packs = await fetchJson<Pack[]>('/packs');
  console.log(`  Got ${packs.length} packs`);

  mkdirSync('src/content', { recursive: true });
  writeFileSync('src/content/packs.json', JSON.stringify(packs, null, 2));

  console.log('Fetching cards for each pack...');
  const allCards: Card[] = [];
  for (const pack of packs) {
    const cards = await fetchJson<Card[]>(`/packs/${pack.code}/cards`);
    allCards.push(...cards);
    if (cards.length > 0) {
      console.log(`  ${pack.name}: ${cards.length} cards`);
    }
  }

  writeFileSync('src/content/cards.json', JSON.stringify(allCards, null, 2));
  console.log(`Total: ${allCards.length} cards written to src/content/cards.json`);
}
