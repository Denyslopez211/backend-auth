import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default class TypeOrmConfig {
  static get(config: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: config.get('DB_HOST') || 'localhost',
      port: config.get('DB_PORT') || 5432,
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: config.get<boolean>('TYPEORM_SYNCHRONIZE') || true,
    };
  }
}
