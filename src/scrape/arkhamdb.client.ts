import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class ArkhamDbClient {
  private readonly logger = new Logger(ArkhamDbClient.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get<string>(
      'ARKHAMDB_BASE_URL',
      'https://arkhamdb.com/api/public',
    );
  }

  async fetchAllCards(): Promise<Record<string, unknown>[]> {
    this.logger.log(
      `Fetching all cards (with encounter) from ${this.baseUrl}/cards/`,
    );
    const data = await lastValueFrom(
      this.httpService
        .get<Record<string, unknown>[]>(`${this.baseUrl}/cards/`, {
          params: { encounter: 1 },
        })
        .pipe(map((res) => res.data)),
    );
    this.logger.log(`Fetched ${data.length} cards`);
    return data;
  }

  async fetchAllPacks(): Promise<Record<string, unknown>[]> {
    this.logger.log(`Fetching all packs from ${this.baseUrl}/packs/`);
    const data = await lastValueFrom(
      this.httpService
        .get<Record<string, unknown>[]>(`${this.baseUrl}/packs/`)
        .pipe(map((res) => res.data)),
    );
    this.logger.log(`Fetched ${data.length} packs`);
    return data;
  }
}
