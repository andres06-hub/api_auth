import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userProviders } from './providers/user.providers';
import { DatabaseModule } from 'src/providers/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [...userProviders, AuthService],
})
export class AuthModule {}
