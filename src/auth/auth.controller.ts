import { Body, Controller, Post } from '@nestjs/common';
import { DataLoginDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { DataSignUp } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private _authSrv: AuthService) {}

  @Post('login')
  async login(@Body() data: DataLoginDto) {
    const { email, password } = data;
    return await this._authSrv.login(email, password);
  }

  @Post('signup')
  async signUp(@Body() data: DataSignUp) {
    return await this._authSrv.createUser(data);
  }
}
