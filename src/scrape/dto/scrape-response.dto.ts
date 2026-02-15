import { ApiProperty } from '@nestjs/swagger';

export class ScrapeResponseDto {
  @ApiProperty({ description: 'Number of packs scraped' })
  packsCount!: number;

  @ApiProperty({ description: 'Number of cards scraped' })
  cardsCount!: number;

  @ApiProperty({ description: 'Number of JSON files written' })
  filesWritten!: number;

  @ApiProperty({ description: 'Summary message' })
  message!: string;
}
