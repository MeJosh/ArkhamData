import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import type { Card, CardDistribution, DifficultyAnalysis, EncounterSetDifficulty } from './lib/types.js';

const cards: Card[] = JSON.parse(readFileSync('src/content/cards.json', 'utf-8'));

mkdirSync('src/content/stats', { recursive: true });

// --- Card Distribution ---
const byType: Record<string, number> = {};
const byFaction: Record<string, number> = {};
const costCurveByFaction: Record<string, Record<string, number>> = {};
const xpByFaction: Record<string, Record<string, number>> = {};
const traitFrequency: Record<string, number> = {};

const playerCards = cards.filter((c) => !c.encounterCode);

for (const card of playerCards) {
  const type = card.typeName || 'Unknown';
  byType[type] = (byType[type] || 0) + 1;

  const faction = card.factionName || 'Unknown';
  byFaction[faction] = (byFaction[faction] || 0) + 1;

  // Cost curve
  if (card.cost !== null) {
    if (!costCurveByFaction[faction]) costCurveByFaction[faction] = {};
    const costKey = card.cost >= 6 ? '6+' : String(card.cost);
    costCurveByFaction[faction][costKey] =
      (costCurveByFaction[faction][costKey] || 0) + 1;
  }

  // XP distribution
  if (card.xp !== null) {
    if (!xpByFaction[faction]) xpByFaction[faction] = {};
    const xpKey = String(card.xp);
    xpByFaction[faction][xpKey] = (xpByFaction[faction][xpKey] || 0) + 1;
  }

  // Trait frequency
  if (card.traits) {
    const traits = card.traits
      .split('.')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    for (const trait of traits) {
      traitFrequency[trait] = (traitFrequency[trait] || 0) + 1;
    }
  }
}

const distribution: CardDistribution = {
  byType,
  byFaction,
  costCurveByFaction,
  xpByFaction,
  traitFrequency,
};

writeFileSync(
  'src/content/stats/card-distribution.json',
  JSON.stringify(distribution, null, 2),
);
console.log('Generated card-distribution.json');

// --- Difficulty Analysis ---
const encounterCards = cards.filter((c) => c.encounterCode);
const encounterGroups = new Map<string, Card[]>();

for (const card of encounterCards) {
  const code = card.encounterCode!;
  if (!encounterGroups.has(code)) encounterGroups.set(code, []);
  encounterGroups.get(code)!.push(card);
}

const encounterSets: EncounterSetDifficulty[] = [];

for (const [code, setCards] of encounterGroups) {
  const enemies = setCards.filter((c) => c.typeCode === 'enemy');
  const treacheries = setCards.filter((c) => c.typeCode === 'treachery');
  const name = setCards[0]?.encounterName || code;

  const avg = (arr: (number | null)[]): number => {
    const nums = arr.filter((n): n is number => n !== null);
    return nums.length > 0 ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100 : 0;
  };

  encounterSets.push({
    encounterCode: code,
    encounterName: name,
    enemyCount: enemies.length,
    avgFight: avg(enemies.map((e) => e.enemyFight)),
    avgEvade: avg(enemies.map((e) => e.enemyEvade)),
    avgDamage: avg(enemies.map((e) => e.enemyDamage)),
    avgHorror: avg(enemies.map((e) => e.enemyHorror)),
    treacheryCount: treacheries.length,
    totalCards: setCards.length,
  });
}

// Sort by composite difficulty (avg fight + evade + damage + horror)
encounterSets.sort((a, b) => {
  const diffA = a.avgFight + a.avgEvade + a.avgDamage + a.avgHorror;
  const diffB = b.avgFight + b.avgEvade + b.avgDamage + b.avgHorror;
  return diffB - diffA;
});

const difficultyAnalysis: DifficultyAnalysis = { encounterSets };

writeFileSync(
  'src/content/stats/difficulty-analysis.json',
  JSON.stringify(difficultyAnalysis, null, 2),
);
console.log('Generated difficulty-analysis.json');

console.log(`Stats: ${playerCards.length} player cards, ${encounterCards.length} encounter cards, ${encounterSets.length} encounter sets`);
