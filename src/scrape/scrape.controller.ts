import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScrapeService } from './scrape.service';
import { ScrapeResponseDto } from './dto/scrape-response.dto';

@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Post()
  @ApiOperation({
    summary: 'Scrape all card data from ArkhamDB',
    description:
      'Fetches all packs and cards from the ArkhamDB API, saves them as JSON files organized by pack, and upserts them into the database.',
  })
  @ApiResponse({
    status: 201,
    description: 'Scrape completed successfully',
    type: ScrapeResponseDto,
  })
  @ApiResponse({
    status: 502,
    description: 'Failed to reach ArkhamDB API',
  })
  async scrape(): Promise<ScrapeResponseDto> {
    return this.scrapeService.scrape();
  }
}
