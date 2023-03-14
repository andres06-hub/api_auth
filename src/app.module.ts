import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { key } from './config/key.config';
import { AuthModule } from './auth/auth.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [AppModule, ConfigModule, AuthModule, ProvidersModule],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {
  static port: number | string;
  static prefix: string;

  constructor(private readonly _configSrv: ConfigService) {
    AppModule.port = this._configSrv.get(key.PORT);
    AppModule.prefix = this._configSrv.get(key.PREFIX);
  }
}
