import {
  Injectable,
  Logger,
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pack } from '../database/entities/pack.entity';
import { Card } from '../database/entities/card.entity';
import { ArkhamDbClient } from './arkhamdb.client';
import { FileStorageService } from '../data-management/file-storage.service';
import { ScrapeResponseDto } from './dto/scrape-response.dto';

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  constructor(
    @InjectRepository(Pack)
    private readonly packRepository: Repository<Pack>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly arkhamDbClient: ArkhamDbClient,
    private readonly fileStorage: FileStorageService,
  ) {}

  async scrape(): Promise<ScrapeResponseDto> {
    let rawPacks: Record<string, unknown>[];
    let rawCards: Record<string, unknown>[];

    try {
      rawPacks = await this.arkhamDbClient.fetchAllPacks();
      rawCards = await this.arkhamDbClient.fetchAllCards();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to fetch from ArkhamDB: ${message}`);
      throw new BadGatewayException(
        `Failed to fetch data from ArkhamDB: ${message}`,
      );
    }

    let filesWritten = 0;

    try {
      // Save raw JSON files
      await this.fileStorage.saveJson('packs.json', rawPacks);
      filesWritten++;

      await this.fileStorage.saveJson('all-cards.json', rawCards);
      filesWritten++;

      // Group cards by pack_code and save per-pack files
      const cardsByPack: Record<string, Record<string, unknown>[]> = {};
      for (const card of rawCards) {
        const packCode = card['pack_code'] as string;
        if (!packCode) continue;
        if (!cardsByPack[packCode]) cardsByPack[packCode] = [];
        cardsByPack[packCode].push(card);
      }

      for (const [packCode, packCards] of Object.entries(cardsByPack)) {
        await this.fileStorage.saveJson(`packs/${packCode}.json`, packCards);
        filesWritten++;
      }

      this.logger.log(`Wrote ${filesWritten} JSON files`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to write JSON files: ${message}`);
      throw new InternalServerErrorException(
        `Failed to write JSON files: ${message}`,
      );
    }

    try {
      // Upsert packs into database
      const packEntities = rawPacks.map((p) => this.mapPack(p));
      await this.packRepository.upsert(packEntities, {
        conflictPaths: ['code'],
      });
      this.logger.log(`Upserted ${packEntities.length} packs into database`);

      // Upsert cards in batches
      const cardEntities = rawCards.map((c) => this.mapCard(c));
      const batchSize = 500;
      for (let i = 0; i < cardEntities.length; i += batchSize) {
        const batch = cardEntities.slice(i, i + batchSize);
        await this.cardRepository.upsert(batch, {
          conflictPaths: ['code'],
        });
      }
      this.logger.log(
        `Upserted ${cardEntities.length} cards into database`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upsert into database: ${message}`);
      throw new InternalServerErrorException(
        `Failed to upsert into database: ${message}`,
      );
    }

    return {
      packsCount: rawPacks.length,
      cardsCount: rawCards.length,
      filesWritten,
      message: `Successfully scraped ${rawPacks.length} packs and ${rawCards.length} cards`,
    };
  }

  private mapPack(raw: Record<string, unknown>): Partial<Pack> {
    return {
      id: raw['id'] as number,
      code: raw['code'] as string,
      name: raw['name'] as string,
      position: (raw['position'] as number) ?? null,
      cyclePosition: (raw['cycle_position'] as number) ?? null,
      available: (raw['available'] as string) ?? null,
      known: (raw['known'] as number) ?? null,
      total: (raw['total'] as number) ?? null,
      url: (raw['url'] as string) ?? null,
    };
  }

  private mapCard(raw: Record<string, unknown>): Partial<Card> {
    return {
      code: raw['code'] as string,
      name: raw['name'] as string,
      realName: (raw['real_name'] as string) ?? null,
      subname: (raw['subname'] as string) ?? null,
      typeCode: (raw['type_code'] as string) ?? null,
      typeName: (raw['type_name'] as string) ?? null,
      factionCode: (raw['faction_code'] as string) ?? null,
      factionName: (raw['faction_name'] as string) ?? null,
      packCode: (raw['pack_code'] as string) ?? null,
      packName: (raw['pack_name'] as string) ?? null,
      position: (raw['position'] as number) ?? null,
      exceptional: (raw['exceptional'] as boolean) ?? null,
      myriad: (raw['myriad'] as boolean) ?? null,
      cost: (raw['cost'] as number) ?? null,
      xp: (raw['xp'] as number) ?? null,
      text: (raw['text'] as string) ?? null,
      realText: (raw['real_text'] as string) ?? null,
      quantity: (raw['quantity'] as number) ?? null,
      skillWillpower: (raw['skill_willpower'] as number) ?? null,
      skillIntellect: (raw['skill_intellect'] as number) ?? null,
      skillCombat: (raw['skill_combat'] as number) ?? null,
      skillAgility: (raw['skill_agility'] as number) ?? null,
      skillWild: (raw['skill_wild'] as number) ?? null,
      health: (raw['health'] as number) ?? null,
      healthPerInvestigator:
        (raw['health_per_investigator'] as boolean) ?? null,
      sanity: (raw['sanity'] as number) ?? null,
      sanityPerInvestigator:
        (raw['sanity_per_investigator'] as boolean) ?? null,
      slot: (raw['slot'] as string) ?? null,
      realSlot: (raw['real_slot'] as string) ?? null,
      traits: (raw['traits'] as string) ?? null,
      realTraits: (raw['real_traits'] as string) ?? null,
      deckLimit: (raw['deck_limit'] as number) ?? null,
      deckRequirements: raw['deck_requirements'] ?? null,
      deckOptions: raw['deck_options'] ?? null,
      flavor: (raw['flavor'] as string) ?? null,
      illustrator: (raw['illustrator'] as string) ?? null,
      isUnique: (raw['is_unique'] as boolean) ?? null,
      permanent: (raw['permanent'] as boolean) ?? null,
      doubleSided: (raw['double_sided'] as boolean) ?? null,
      backText: (raw['back_text'] as string) ?? null,
      backFlavor: (raw['back_flavor'] as string) ?? null,
      octgnId: (raw['octgn_id'] as string) ?? null,
      url: (raw['url'] as string) ?? null,
      imagesrc: (raw['imagesrc'] as string) ?? null,
      backimagesrc: (raw['backimagesrc'] as string) ?? null,
      duplicatedBy: raw['duplicated_by'] ?? null,
      alternatedBy: raw['alternated_by'] ?? null,
      subtypeCode: (raw['subtype_code'] as string) ?? null,
      subtypeName: (raw['subtype_name'] as string) ?? null,
      enemyDamage: (raw['enemy_damage'] as number) ?? null,
      enemyHorror: (raw['enemy_horror'] as number) ?? null,
      enemyFight: (raw['enemy_fight'] as number) ?? null,
      enemyEvade: (raw['enemy_evade'] as number) ?? null,
      victory: (raw['victory'] as number) ?? null,
      restrictions: raw['restrictions'] ?? null,
      errataDate: (raw['errata_date'] as string) ?? null,
    };
  }
}
