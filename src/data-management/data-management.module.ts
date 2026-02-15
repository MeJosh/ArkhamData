import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from '../database/entities/pack.entity';
import { Card } from '../database/entities/card.entity';
import { FileStorageService } from './file-storage.service';
import { DataManagementService } from './data-management.service';
import { DataManagementController } from './data-management.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pack, Card])],
  controllers: [DataManagementController],
  providers: [FileStorageService, DataManagementService],
  exports: [FileStorageService],
})
export class DataManagementModule {}
