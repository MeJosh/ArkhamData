import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PacksService } from './packs.service';

@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  @ApiOperation({ summary: 'List all card sets/packs' })
  @ApiResponse({ status: 200, description: 'All available packs' })
  async findAll() {
    return this.packsService.findAll();
  }

  @Get(':code/cards')
  @ApiOperation({ summary: 'Get all cards in a specific pack' })
  @ApiParam({ name: 'code', description: 'Pack code (e.g. "core", "dwl")' })
  @ApiResponse({ status: 200, description: 'Cards in the specified pack' })
  @ApiResponse({ status: 404, description: 'Pack not found' })
  async findCardsByPackCode(@Param('code') code: string) {
    return this.packsService.findCardsByPackCode(code);
  }
}
