import { Controller, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DataManagementService } from './data-management.service';

@Controller('data')
export class DataManagementController {
  constructor(private readonly dataManagementService: DataManagementService) {}

  @Delete()
  @ApiOperation({ summary: 'Clear all scraped data (files and database)' })
  @ApiResponse({ status: 200, description: 'All data cleared successfully' })
  async clearAll() {
    return this.dataManagementService.clearAll();
  }
}
