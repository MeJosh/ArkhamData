import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'path';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @ApiOperation({ summary: 'List all available campaigns' })
  @ApiResponse({ status: 200, description: 'All campaigns' })
  async findAll() {
    return this.campaignsService.findAllCampaigns();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a campaign by its code' })
  @ApiParam({ name: 'code', description: 'Campaign code (e.g. "notz")' })
  @ApiResponse({ status: 200, description: 'Campaign metadata' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findByCode(@Param('code') code: string) {
    return this.campaignsService.findCampaignByCode(code);
  }

  @Get(':code/scenarios')
  @ApiOperation({ summary: 'List all scenarios in a campaign' })
  @ApiParam({ name: 'code', description: 'Campaign code (e.g. "notz")' })
  @ApiResponse({ status: 200, description: 'Scenarios for the campaign' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findScenarios(@Param('code') code: string) {
    return this.campaignsService.findScenarios(code);
  }

  @Get(':code/scenarios/:number')
  @ApiOperation({ summary: 'Get a specific scenario by number' })
  @ApiParam({ name: 'code', description: 'Campaign code (e.g. "notz")' })
  @ApiParam({ name: 'number', description: 'Scenario number (e.g. 1, 2, 3)' })
  @ApiResponse({ status: 200, description: 'Scenario data' })
  @ApiResponse({ status: 404, description: 'Scenario not found' })
  async findScenario(
    @Param('code') code: string,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.campaignsService.findScenarioByNumber(code, number);
  }

  @Get(':code/scenarios/:number/cards')
  @ApiOperation({ summary: 'Get all cards for a scenario (flat list)' })
  @ApiParam({ name: 'code', description: 'Campaign code (e.g. "notz")' })
  @ApiParam({ name: 'number', description: 'Scenario number (e.g. 1, 2, 3)' })
  @ApiResponse({ status: 200, description: 'All cards for the scenario' })
  @ApiResponse({ status: 404, description: 'Scenario not found' })
  async getScenarioCards(
    @Param('code') code: string,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.campaignsService.getScenarioCards(code, number);
  }

  @Get(':code/scenarios/:number/cards/acts')
  @ApiOperation({ summary: 'Get act cards for a scenario' })
  @ApiParam({ name: 'code', description: 'Campaign code' })
  @ApiParam({ name: 'number', description: 'Scenario number' })
  @ApiResponse({ status: 200, description: 'Act cards' })
  async getScenarioActs(
    @Param('code') code: string,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.campaignsService.getScenarioCards(code, number, 'act');
  }

  @Get(':code/scenarios/:number/cards/agendas')
  @ApiOperation({ summary: 'Get agenda cards for a scenario' })
  @ApiParam({ name: 'code', description: 'Campaign code' })
  @ApiParam({ name: 'number', description: 'Scenario number' })
  @ApiResponse({ status: 200, description: 'Agenda cards' })
  async getScenarioAgendas(
    @Param('code') code: string,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.campaignsService.getScenarioCards(code, number, 'agenda');
  }

  @Get(':code/scenarios/:number/cards/locations')
  @ApiOperation({ summary: 'Get location cards for a scenario' })
  @ApiParam({ name: 'code', description: 'Campaign code' })
  @ApiParam({ name: 'number', description: 'Scenario number' })
  @ApiResponse({ status: 200, description: 'Location cards' })
  async getScenarioLocations(
    @Param('code') code: string,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.campaignsService.getScenarioCards(code, number, 'location');
  }

  @Get(':code/scenarios/:number/cards/treacheries')
  @ApiOperation({ summary: 'Get treachery cards for a scenario' })
  @ApiParam({ name: 'code', description: 'Campaign code' })
  @ApiParam({ name: 'number', description: 'Scenario number' })
  @ApiResponse({ status: 200, description: 'Treachery cards' })
  async getScenarioTreacheries(
    @Param('code') code: string,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.campaignsService.getScenarioCards(code, number, 'treachery');
  }

  @Get(':code/scenarios/:number/cards/enemies')
  @ApiOperation({ summary: 'Get enemy cards for a scenario' })
  @ApiParam({ name: 'code', description: 'Campaign code' })
  @ApiParam({ name: 'number', description: 'Scenario number' })
  @ApiResponse({ status: 200, description: 'Enemy cards' })
  async getScenarioEnemies(
    @Param('code') code: string,
    @Param('number', ParseIntPipe) number: number,
  ) {
    return this.campaignsService.getScenarioCards(code, number, 'enemy');
  }

  @Get(':code/guide')
  @ApiOperation({ summary: 'Download the campaign guide PDF' })
  @ApiParam({ name: 'code', description: 'Campaign code (e.g. "notz")' })
  @ApiResponse({ status: 200, description: 'Campaign guide PDF file' })
  @ApiResponse({ status: 404, description: 'Campaign or guide not found' })
  async downloadGuide(
    @Param('code') code: string,
    @Res() res: Response,
  ) {
    const guidePath = await this.campaignsService.getCampaignGuidePath(code);
    const filename = path.basename(guidePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(guidePath);
  }
}
