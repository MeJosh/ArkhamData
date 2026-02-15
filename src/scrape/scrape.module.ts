import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from '../database/entities/pack.entity';
import { Card } from '../database/entities/card.entity';
import { ScrapeController } from './scrape.controller';
import { ScrapeService } from './scrape.service';
import { ArkhamDbClient } from './arkhamdb.client';
import { DataManagementModule } from '../data-management/data-management.module';

@Module({
  imports: [
    HttpModule.register({ timeout: 30000 }),
    TypeOrmModule.forFeature([Pack, Card]),
    DataManagementModule,
  ],
  controllers: [ScrapeController],
  providers: [ScrapeService, ArkhamDbClient],
})
export class ScrapeModule {}
