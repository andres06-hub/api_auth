import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userProviders } from './providers/user.providers';
import { DatabaseModule } from 'src/providers/database/database.module';
import { BcryptService } from 'src/common/services/bcrypt/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_KEY'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES'),
          },
        };
      },
    }),
    // JwtModule.register({
    //   secret: JWTKEYS.secret,
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  controllers: [AuthController],
  providers: [...userProviders, AuthService, BcryptService, JwtStrategy],
})
export class AuthModule {}
