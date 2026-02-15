import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../database/entities/card.entity';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
