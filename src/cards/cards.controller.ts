import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':code')
  @ApiOperation({ summary: 'Get a card by its unique code' })
  @ApiParam({ name: 'code', description: 'Card code (e.g. "01001")' })
  @ApiResponse({ status: 200, description: 'The card' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  async findByCode(@Param('code') code: string) {
    return this.cardsService.findByCode(code);
  }
}
