import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST', 'localhost'),
  port: configService.get<number>('POSTGRES_PORT', 5432),
  username: configService.get<string>('POSTGRES_USER', 'arkham'),
  password: configService.get<string>('POSTGRES_PASSWORD', 'arkham_secret'),
  database: configService.get<string>('POSTGRES_DB', 'arkhamdata'),
  autoLoadEntities: true,
  synchronize: true,
});
