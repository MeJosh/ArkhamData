export interface Pack {
  id: number;
  code: string;
  name: string;
  position: number | null;
  cyclePosition: number | null;
  available: string | null;
  known: number | null;
  total: number | null;
  url: string | null;
}

export interface Card {
  code: string;
  name: string;
  realName: string | null;
  subname: string | null;
  typeCode: string | null;
  typeName: string | null;
  factionCode: string | null;
  factionName: string | null;
  packCode: string | null;
  packName: string | null;
  position: number | null;
  exceptional: boolean | null;
  myriad: boolean | null;
  cost: number | null;
  xp: number | null;
  text: string | null;
  realText: string | null;
  quantity: number | null;
  skillWillpower: number | null;
  skillIntellect: number | null;
  skillCombat: number | null;
  skillAgility: number | null;
  skillWild: number | null;
  health: number | null;
  healthPerInvestigator: boolean | null;
  sanity: number | null;
  sanityPerInvestigator: boolean | null;
  slot: string | null;
  realSlot: string | null;
  traits: string | null;
  realTraits: string | null;
  deckLimit: number | null;
  deckRequirements: unknown;
  deckOptions: unknown;
  flavor: string | null;
  illustrator: string | null;
  isUnique: boolean | null;
  permanent: boolean | null;
  doubleSided: boolean | null;
  backText: string | null;
  backFlavor: string | null;
  octgnId: string | null;
  url: string | null;
  imagesrc: string | null;
  backimagesrc: string | null;
  duplicatedBy: unknown;
  alternatedBy: unknown;
  subtypeCode: string | null;
  subtypeName: string | null;
  enemyDamage: number | null;
  enemyHorror: number | null;
  enemyFight: number | null;
  enemyEvade: number | null;
  victory: number | null;
  restrictions: unknown;
  errataDate: string | null;
  encounterCode: string | null;
  encounterName: string | null;
  encounterPosition: number | null;
  spoiler: number | null;
}

export interface EncounterSetRef {
  name: string;
  code: string;
}

export interface ScenarioMeta {
  name: string;
  number: number;
  code: string;
  campaignCode: string;
  description: string;
  encounterSets: EncounterSetRef[];
  separateDecks?: { name: string; encounterSet: EncounterSetRef }[];
  randomEncounterSets?: { pick: number; from: EncounterSetRef[] };
}

export interface CampaignMeta {
  name: string;
  code: string;
  description: string;
  cyclePosition: number;
  packCodes: string[];
  scenarios: string[];
  campaignGuide: string;
}

// Stats types
export interface CardDistribution {
  byType: Record<string, number>;
  byFaction: Record<string, number>;
  costCurveByFaction: Record<string, Record<string, number>>;
  xpByFaction: Record<string, Record<string, number>>;
  traitFrequency: Record<string, number>;
}

export interface EncounterSetDifficulty {
  encounterCode: string;
  encounterName: string;
  enemyCount: number;
  avgFight: number;
  avgEvade: number;
  avgDamage: number;
  avgHorror: number;
  treacheryCount: number;
  totalCards: number;
}

export interface DifficultyAnalysis {
  encounterSets: EncounterSetDifficulty[];
}
