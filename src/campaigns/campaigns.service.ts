import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Card } from '../database/entities/card.entity';

export interface CampaignMeta {
  name: string;
  code: string;
  description: string;
  cyclePosition: number;
  packCodes: string[];
  scenarios: string[];
  campaignGuide: string;
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
  [key: string]: unknown;
}

@Injectable()
export class CampaignsService {
  private readonly dataDir: string;

  constructor(
    configService: ConfigService,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {
    this.dataDir = configService.get<string>('DATA_DIR', './data');
  }

  private get campaignsDir(): string {
    return path.join(this.dataDir, 'campaigns');
  }

  async findAllCampaigns(): Promise<CampaignMeta[]> {
    const campaignsPath = this.campaignsDir;

    let entries: string[];
    try {
      entries = await fs.readdir(campaignsPath);
    } catch {
      return [];
    }

    const campaigns: CampaignMeta[] = [];
    for (const entry of entries) {
      const campaignFile = path.join(campaignsPath, entry, 'campaign.json');
      try {
        const raw = await fs.readFile(campaignFile, 'utf-8');
        campaigns.push(JSON.parse(raw));
      } catch {
        // skip directories without a valid campaign.json
      }
    }

    campaigns.sort((a, b) => a.cyclePosition - b.cyclePosition);
    return campaigns;
  }

  async findCampaignByCode(code: string): Promise<CampaignMeta> {
    const campaigns = await this.findAllCampaigns();
    const campaign = campaigns.find((c) => c.code === code);
    if (!campaign) {
      throw new NotFoundException(`Campaign with code "${code}" not found`);
    }
    return campaign;
  }

  private async findCampaignDir(code: string): Promise<string> {
    const campaignsPath = this.campaignsDir;
    let entries: string[];
    try {
      entries = await fs.readdir(campaignsPath);
    } catch {
      throw new NotFoundException(`Campaign with code "${code}" not found`);
    }

    for (const entry of entries) {
      const campaignFile = path.join(campaignsPath, entry, 'campaign.json');
      try {
        const raw = await fs.readFile(campaignFile, 'utf-8');
        const campaign = JSON.parse(raw) as CampaignMeta;
        if (campaign.code === code) {
          return path.join(campaignsPath, entry);
        }
      } catch {
        // skip
      }
    }

    throw new NotFoundException(`Campaign with code "${code}" not found`);
  }

  async findScenarios(campaignCode: string): Promise<ScenarioMeta[]> {
    const campaignDir = await this.findCampaignDir(campaignCode);
    const campaignRaw = await fs.readFile(
      path.join(campaignDir, 'campaign.json'),
      'utf-8',
    );
    const campaign = JSON.parse(campaignRaw) as CampaignMeta;

    const scenarios: ScenarioMeta[] = [];
    for (const scenarioPath of campaign.scenarios) {
      const fullPath = path.join(campaignDir, scenarioPath);
      const raw = await fs.readFile(fullPath, 'utf-8');
      scenarios.push(JSON.parse(raw));
    }

    scenarios.sort((a, b) => a.number - b.number);
    return scenarios;
  }

  async findScenarioByNumber(
    campaignCode: string,
    scenarioNumber: number,
  ): Promise<ScenarioMeta> {
    const scenarios = await this.findScenarios(campaignCode);
    const scenario = scenarios.find((s) => s.number === scenarioNumber);
    if (!scenario) {
      throw new NotFoundException(
        `Scenario #${scenarioNumber} not found in campaign "${campaignCode}"`,
      );
    }
    return scenario;
  }

  async getScenarioCards(
    campaignCode: string,
    scenarioNumber: number,
    typeFilter?: string,
  ): Promise<Card[]> {
    const scenario = await this.findScenarioByNumber(
      campaignCode,
      scenarioNumber,
    );

    const allEncounterCodes = this.collectAllEncounterCodes(scenario);

    const where: Record<string, unknown> = {
      encounterCode: In(allEncounterCodes),
    };
    if (typeFilter) {
      where['typeCode'] = typeFilter;
    }

    return this.cardRepository.find({
      where,
      order: { encounterCode: 'ASC', encounterPosition: 'ASC' },
    });
  }

  private collectAllEncounterCodes(scenario: ScenarioMeta): string[] {
    const codes: string[] = scenario.encounterSets.map((es) => es.code);

    if (scenario.separateDecks) {
      for (const deck of scenario.separateDecks) {
        codes.push(deck.encounterSet.code);
      }
    }

    if (scenario.randomEncounterSets) {
      for (const es of scenario.randomEncounterSets.from) {
        codes.push(es.code);
      }
    }

    return codes;
  }

  async getCampaignGuidePath(campaignCode: string): Promise<string> {
    const campaignDir = await this.findCampaignDir(campaignCode);
    const campaignRaw = await fs.readFile(
      path.join(campaignDir, 'campaign.json'),
      'utf-8',
    );
    const campaign = JSON.parse(campaignRaw) as CampaignMeta;

    if (!campaign.campaignGuide) {
      throw new NotFoundException(
        `No campaign guide configured for "${campaignCode}"`,
      );
    }

    const guidePath = path.join(campaignDir, campaign.campaignGuide);
    try {
      await fs.access(guidePath);
    } catch {
      throw new NotFoundException(
        `Campaign guide file not found for "${campaignCode}"`,
      );
    }

    return guidePath;
  }
}
