import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private readonly dataDir: string;

  constructor(configService: ConfigService) {
    this.dataDir = configService.get<string>('DATA_DIR', './data');
  }

  async saveJson(relativePath: string, data: unknown): Promise<void> {
    const fullPath = path.join(this.dataDir, relativePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async clearAllFiles(): Promise<void> {
    await fs.rm(this.dataDir, { recursive: true, force: true });
    await fs.mkdir(this.dataDir, { recursive: true });
  }
}
