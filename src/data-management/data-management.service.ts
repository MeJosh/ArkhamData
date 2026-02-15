import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pack } from '../database/entities/pack.entity';
import { Card } from '../database/entities/card.entity';
import { FileStorageService } from './file-storage.service';

@Injectable()
export class DataManagementService {
  private readonly logger = new Logger(DataManagementService.name);

  constructor(
    @InjectRepository(Pack)
    private readonly packRepository: Repository<Pack>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly fileStorage: FileStorageService,
  ) {}

  async clearAll(): Promise<{ message: string }> {
    this.logger.log('Clearing all data...');

    await this.fileStorage.clearAllFiles();
    this.logger.log('JSON files cleared');

    await this.cardRepository.query('TRUNCATE TABLE cards, packs CASCADE');
    this.logger.log('Database tables truncated');

    return { message: 'All data cleared successfully' };
  }
}
