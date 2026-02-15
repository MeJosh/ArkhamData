import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScrapeModule } from './scrape/scrape.module';
import { DataManagementModule } from './data-management/data-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ScrapeModule,
    DataManagementModule,
  ],
})
export class AppModule {}
