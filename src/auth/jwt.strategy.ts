import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWTKEYS } from '../common/constants/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWTKEYS.secret,
    });
  }

  async validate(payload: any) {
    //TODO:Validar el usuario con los datos del Payload EJ:
    // const user = await this.userModel.findById(payload.id);
    // return user;
    return { userId: payload.sub, username: payload.username };
  }
}
