import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { AppConfig } from './config/configuration';
import { RedisModule } from './modules/redis/redis.module';
import { ItemsModule } from './modules/items/items.module';
import { DebugModule } from './modules/debug/debug.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    RedisModule,
    ItemsModule,
    DebugModule,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(private configService: ConfigService) {
    const appConfig = this.configService.get<AppConfig>('app');
    this.logger.log(`Application running in ${appConfig.environment} mode`);
  }
}
