import { writeFileSync, mkdirSync } from 'fs';
import { fetchJson } from './lib/api-client.js';
import type { CampaignMeta, ScenarioMeta, Card } from './lib/types.js';

export async function fetchCampaigns() {
  console.log('Fetching campaigns...');
  const campaigns = await fetchJson<CampaignMeta[]>('/campaigns');
  console.log(`  Got ${campaigns.length} campaigns`);

  mkdirSync('src/content/campaigns', { recursive: true });

  for (const campaign of campaigns) {
    const dir = `src/content/campaigns/${campaign.code}`;
    mkdirSync(dir, { recursive: true });

    writeFileSync(
      `src/content/campaigns/${campaign.code}.json`,
      JSON.stringify(campaign, null, 2),
    );

    console.log(`Fetching scenarios for ${campaign.name}...`);
    const scenarios = await fetchJson<ScenarioMeta[]>(
      `/campaigns/${campaign.code}/scenarios`,
    );
    writeFileSync(`${dir}/scenarios.json`, JSON.stringify(scenarios, null, 2));
    console.log(`  Got ${scenarios.length} scenarios`);

    for (const scenario of scenarios) {
      const cards = await fetchJson<Card[]>(
        `/campaigns/${campaign.code}/scenarios/${scenario.number}/cards`,
      );
      writeFileSync(
        `${dir}/scenario-${scenario.number}-cards.json`,
        JSON.stringify(cards, null, 2),
      );
      console.log(`  ${scenario.name}: ${cards.length} cards`);
    }
  }
}
