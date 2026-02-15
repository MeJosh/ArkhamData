import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pack } from '../database/entities/pack.entity';
import { Card } from '../database/entities/card.entity';

@Injectable()
export class PacksService {
  constructor(
    @InjectRepository(Pack)
    private readonly packRepository: Repository<Pack>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async findAll(): Promise<Pack[]> {
    return this.packRepository.find({ order: { cyclePosition: 'ASC', position: 'ASC' } });
  }

  async findCardsByPackCode(code: string): Promise<Card[]> {
    const pack = await this.packRepository.findOne({ where: { code } });
    if (!pack) {
      throw new NotFoundException(`Pack with code "${code}" not found`);
    }

    return this.cardRepository.find({
      where: { packCode: code },
      order: { position: 'ASC' },
    });
  }
}
