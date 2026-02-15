import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../database/entities/card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async findByCode(code: string): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { code } });
    if (!card) {
      throw new NotFoundException(`Card with code "${code}" not found`);
    }
    return card;
  }
}
