import { Injectable } from '@nestjs/common';
import { ConfigService as ConfigSrv } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private _configSrv: ConfigSrv) {}

  get<T>(key: string): T {
    return this._configSrv.get(key);
  }
}
