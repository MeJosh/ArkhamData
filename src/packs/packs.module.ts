import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from '../database/entities/pack.entity';
import { Card } from '../database/entities/card.entity';
import { PacksController } from './packs.controller';
import { PacksService } from './packs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pack, Card])],
  controllers: [PacksController],
  providers: [PacksService],
})
export class PacksModule {}
