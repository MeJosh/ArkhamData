import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScrapeModule } from './scrape/scrape.module';
import { DataManagementModule } from './data-management/data-management.module';
import { PacksModule } from './packs/packs.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ScrapeModule,
    DataManagementModule,
    PacksModule,
    CardsModule,
  ],
})
export class AppModule {}
