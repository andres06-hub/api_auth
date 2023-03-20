import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
// import { JWTKEYS } from '../constants/jwt.constants';
import { key } from 'src/config/key.config';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from 'src/models/user.entity';
import { JwtPayload } from '../interfaces/jwt';
import { Response } from 'src/common/interfaces/response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    _configSrv: ConfigService,
    private readonly _authSrv: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configSrv.get<string>(key.JWT_KEY),
    });
  }
  private logger = new Logger();

  async validate(payload: JwtPayload) {
    this.logger.log('VALIDATION JWT ', payload);
    const { id } = payload;
    const user: User | null | false = await this._authSrv.findOneById(id);
    if (!user) {
      throw new UnauthorizedException(new Response(false, 'Unauthorized'));
    }
    return user;
  }
}
