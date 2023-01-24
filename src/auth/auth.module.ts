import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userProviders } from './providers/user.providers';
import { DatabaseModule } from 'src/providers/database/database.module';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTKEYS } from 'src/common/constants/jwt.constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: JWTKEYS.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [...userProviders, AuthService, BcryptService, JwtStrategy],
})
export class AuthModule {}
